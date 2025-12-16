#!/usr/bin/env node

/**
 * Solid Button Text Migration Script
 *
 * Migrates buttons with solid backgrounds (primary, accent, semantic colors) from
 * `text-[var(--primary-text)]` or `text-[var(--foreground)]` to `text-[var(--button-active-text)]`
 * for better contrast in both themes.
 *
 * Usage:
 *   node scripts/migrate-solid-button-text.js          # Preview changes (dry run)
 *   node scripts/migrate-solid-button-text.js --write  # Apply changes
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const DRY_RUN = !process.argv.includes('--write');

// Solid background patterns to match (raw patterns, will be escaped in regex)
const solidBackgroundPatterns = [
  'bg-[var(--primary)]',
  'bg-[var(--accent)]',
  'bg-[var(--color-error)]',
  'bg-[var(--color-warning)]',
  'bg-[var(--color-info)]',
  'bg-[var(--color-success)]',
];

// Text patterns to replace (raw patterns, will be escaped in regex)
const textPatterns = [
  'text-[var(--primary-text)]',
  'text-[var(--foreground)]',
];

// Files to process
const filePatterns = [
  'app/webapp/**/*.{tsx,ts}',
  'components/**/*.{tsx,ts}',
];

// Files to skip
const skipPatterns = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/build/**',
  '**/*.test.{tsx,ts}',
  '**/*.spec.{tsx,ts}',
];

/**
 * Check if a background is subtle (opacity < 30%)
 */
function isSubtleBackground(className) {
  // Check for opacity patterns like /10, /20, etc.
  const opacityMatch = className.match(/bg-\[var\([^)]+\)\]\/(\d+)/);
  if (opacityMatch) {
    const opacity = parseInt(opacityMatch[1]);
    return opacity < 30;
  }
  // Also check for hover states with low opacity
  const hoverOpacityMatch = className.match(/hover:bg-\[var\([^)]+\)\]\/(\d+)/);
  if (hoverOpacityMatch) {
    const opacity = parseInt(hoverOpacityMatch[1]);
    if (opacity < 30 && !className.match(/bg-\[var\([^)]+\)\](?!\/)/)) {
      // Only subtle hover, no solid base background
      return true;
    }
  }
  return false;
}

/**
 * Check if line contains a solid background (not subtle)
 */
function hasSolidBackground(content, lineIndex) {
  const lines = content.split('\n');
  const start = Math.max(0, lineIndex - 3);
  const end = Math.min(lines.length, lineIndex + 3);

  const context = lines.slice(start, end).join('\n');

  // Check for solid backgrounds (not subtle)
  for (const pattern of solidBackgroundPatterns) {
    // Escape special regex characters
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedPattern);
    if (regex.test(context)) {
      // Make sure it's not a subtle background
      if (!isSubtleBackground(context)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let modified = false;
  const changes = [];
  let newContent = content;

  // Pattern 1: Direct className strings with solid background and dark text
  for (const bgPattern of solidBackgroundPatterns) {
    for (const textPattern of textPatterns) {
      // Match: className="... bg-[var(--primary)] ... text-[var(--primary-text)] ..."
      // Escape special regex characters in patterns
      const escapedBgPattern = bgPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escapedTextPattern = textPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Build regex pattern using string concatenation to avoid template literal issues
      const regexPattern = '(className=["\'`][^"\'`]*' + escapedBgPattern + '[^"\'`]*' + escapedTextPattern + '[^"\'`]*["\'`])';
      const regex = new RegExp(regexPattern, 'g');

      const matches = content.matchAll(regex);
      for (const match of matches) {
        const original = match[0];
        // Skip if it's a subtle background
        if (isSubtleBackground(original)) {
          continue;
        }

        const updated = original.replace(
          new RegExp(textPattern, 'g'),
          'text-[var(--button-active-text)]'
        );

        if (original !== updated) {
          newContent = newContent.replace(original, updated);
          modified = true;
          changes.push({
            line: content.substring(0, match.index).split('\n').length,
            original: original.substring(0, 100) + (original.length > 100 ? '...' : ''),
            updated: updated.substring(0, 100) + (updated.length > 100 ? '...' : ''),
          });
        }
      }
    }
  }

  // Pattern 2: Template literals
  for (const bgPattern of solidBackgroundPatterns) {
    for (const textPattern of textPatterns) {
      // Escape special regex characters in patterns
      const escapedBgPattern = bgPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escapedTextPattern = textPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Build regex pattern using string concatenation
      const regexPattern = '(className=\\{`[^`]*' + escapedBgPattern + '[^`]*' + escapedTextPattern + '[^`]*`\\})';
      const regex = new RegExp(regexPattern, 'g');

      const matches = content.matchAll(regex);
      for (const match of matches) {
        const original = match[0];
        // Skip if it's a subtle background
        if (isSubtleBackground(original)) {
          continue;
        }

        const escapedTextPattern = textPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Use simple string replace - escape special regex chars in the pattern
        const escapedPattern = textPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const updated = original.replace(new RegExp(escapedPattern, 'g'), 'text-[var(--button-active-text)]');

        if (original !== updated) {
          newContent = newContent.replace(original, updated);
          modified = true;
          changes.push({
            line: content.substring(0, match.index).split('\n').length,
            original: original.substring(0, 100) + (original.length > 100 ? '...' : ''),
            updated: updated.substring(0, 100) + (updated.length > 100 ? '...' : ''),
          });
        }
      }
    }
  }

  // Pattern 3: Separate className strings (check within 5 lines)
  lines.forEach((line, index) => {
    // Check if line has dark text (simple string check, not regex)
    const hasDarkText = textPatterns.some(pattern => {
      return line.includes(pattern);
    });

    if (hasDarkText && hasSolidBackground(content, index)) {
      // Check if this is part of a button element
      const isButtonContext =
        /<button/.test(lines.slice(Math.max(0, index - 5), index + 1).join('\n')) ||
        /className/.test(lines.slice(Math.max(0, index - 2), index + 2).join('\n')) ||
        /file:/.test(lines.slice(Math.max(0, index - 2), index + 2).join('\n')); // File input buttons

      // Skip outline buttons (have border but no solid background in this line)
      const isOutlineButton = /border.*border-\[var\(--border\)\]/.test(line) &&
        !solidBackgroundPatterns.some(pattern => new RegExp(pattern).test(line));

      if (isButtonContext && !isOutlineButton) {
        let updatedLine = line;
        for (const textPattern of textPatterns) {
          if (updatedLine.includes(textPattern)) {
            // Escape special regex chars for replacement
            const escapedPattern = textPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            updatedLine = updatedLine.replace(new RegExp(escapedPattern, 'g'), 'text-[var(--button-active-text)]');
          }
        }

        if (updatedLine !== line) {
          const lineContent = newContent.split('\n');
          lineContent[index] = updatedLine;
          newContent = lineContent.join('\n');
          modified = true;
          changes.push({
            line: index + 1,
            original: line.trim().substring(0, 100) + (line.trim().length > 100 ? '...' : ''),
            updated: updatedLine.trim().substring(0, 100) + (updatedLine.trim().length > 100 ? '...' : ''),
          });
        }
      }
    }
  });

  return { modified, newContent, changes };
}

/**
 * Main execution
 */
async function main() {
  console.log(`\n🔍 Solid Button Text Migration Script`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (preview only)' : 'WRITE MODE (will modify files)'}\n`);

  const allFiles = [];
  for (const pattern of filePatterns) {
    const files = await glob(pattern, {
      ignore: skipPatterns,
    });
    allFiles.push(...files);
  }

  const uniqueFiles = [...new Set(allFiles)];
  console.log(`Found ${uniqueFiles.length} files to check\n`);

  let totalModified = 0;
  let totalChanges = 0;

  for (const filePath of uniqueFiles.sort()) {
    try {
      const { modified, newContent, changes } = processFile(filePath);

      if (modified) {
        totalModified++;
        totalChanges += changes.length;

        console.log(`📝 ${filePath}`);
        changes.forEach(change => {
          console.log(`   Line ${change.line}:`);
          console.log(`   - ${change.original}`);
          console.log(`   + ${change.updated}`);
        });
        console.log('');

        if (!DRY_RUN) {
          fs.writeFileSync(filePath, newContent, 'utf8');
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  console.log(`\n✅ Summary:`);
  console.log(`   Files modified: ${totalModified}`);
  console.log(`   Total changes: ${totalChanges}`);

  if (DRY_RUN) {
    console.log(`\n💡 Run with --write flag to apply changes:`);
    console.log(`   node scripts/migrate-solid-button-text.js --write\n`);
  } else {
    console.log(`\n✅ Changes applied successfully!\n`);
  }
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
