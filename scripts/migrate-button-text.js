#!/usr/bin/env node

/**
 * Button Text Migration Script
 *
 * Migrates buttons with gradient backgrounds from `text-[var(--primary-text)]` or `text-[var(--foreground)]`
 * to `text-[var(--button-active-text)]` for better contrast in both themes.
 *
 * Usage:
 *   node scripts/migrate-button-text.js          # Preview changes (dry run)
 *   node scripts/migrate-button-text.js --write  # Apply changes
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const DRY_RUN = !process.argv.includes('--write');

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
 * Check if a line or nearby lines contain bg-gradient pattern
 */
function hasGradient(content, lineIndex) {
  const lines = content.split('\n');
  const start = Math.max(0, lineIndex - 3);
  const end = Math.min(lines.length, lineIndex + 3);

  const context = lines.slice(start, end).join('\n');
  return /bg-gradient/.test(context);
}

/**
 * Process a single file
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let modified = false;
  const changes = [];

  // First pass: Direct replacements in className strings
  let newContent = content;

  // Replace pattern 1: Direct className strings with text-[var(--primary-text)]
  const directMatchesPrimary = content.matchAll(/(className=["'`][^"'`]*bg-gradient[^"'`]*text-\[var\(--primary-text\)\][^"'`]*["'`])/g);
  for (const match of directMatchesPrimary) {
    const original = match[0];
    const updated = original.replace(/text-\[var\(--primary-text\)\]/g, 'text-[var(--button-active-text)]');
    if (original !== updated) {
      newContent = newContent.replace(original, updated);
      modified = true;
      changes.push({
        line: content.substring(0, match.index).split('\n').length,
        original: original.substring(0, 80) + (original.length > 80 ? '...' : ''),
        updated: updated.substring(0, 80) + (updated.length > 80 ? '...' : ''),
      });
    }
  }

  // Replace pattern 2: Direct className strings with text-[var(--foreground)]
  const directMatchesForeground = content.matchAll(/(className=["'`][^"'`]*bg-gradient[^"'`]*text-\[var\(--foreground\)\][^"'`]*["'`])/g);
  for (const match of directMatchesForeground) {
    const original = match[0];
    const updated = original.replace(/text-\[var\(--foreground\)\]/g, 'text-[var(--button-active-text)]');
    if (original !== updated) {
      newContent = newContent.replace(original, updated);
      modified = true;
      changes.push({
        line: content.substring(0, match.index).split('\n').length,
        original: original.substring(0, 80) + (original.length > 80 ? '...' : ''),
        updated: updated.substring(0, 80) + (updated.length > 80 ? '...' : ''),
      });
    }
  }

  // Replace pattern 3: Template literals with text-[var(--primary-text)]
  const templateMatchesPrimary = content.matchAll(/(className=\{`[^`]*bg-gradient[^`]*text-\[var\(--primary-text\)\][^`]*`\})/g);
  for (const match of templateMatchesPrimary) {
    const original = match[0];
    const updated = original.replace(/text-\[var\(--primary-text\)\]/g, 'text-[var(--button-active-text)]');
    if (original !== updated) {
      newContent = newContent.replace(original, updated);
      modified = true;
      changes.push({
        line: content.substring(0, match.index).split('\n').length,
        original: original.substring(0, 80) + (original.length > 80 ? '...' : ''),
        updated: updated.substring(0, 80) + (updated.length > 80 ? '...' : ''),
      });
    }
  }

  // Replace pattern 4: Template literals with text-[var(--foreground)]
  const templateMatchesForeground = content.matchAll(/(className=\{`[^`]*bg-gradient[^`]*text-\[var\(--foreground\)\][^`]*`\})/g);
  for (const match of templateMatchesForeground) {
    const original = match[0];
    const updated = original.replace(/text-\[var\(--foreground\)\]/g, 'text-[var(--button-active-text)]');
    if (original !== updated) {
      newContent = newContent.replace(original, updated);
      modified = true;
      changes.push({
        line: content.substring(0, match.index).split('\n').length,
        original: original.substring(0, 80) + (original.length > 80 ? '...' : ''),
        updated: updated.substring(0, 80) + (updated.length > 80 ? '...' : ''),
      });
    }
  }

  // Second pass: Handle cases where bg-gradient and text variables are in separate parts
  // Check each line for text-[var(--primary-text)] or text-[var(--foreground)] and verify nearby lines have bg-gradient
  lines.forEach((line, index) => {
    // Check for text-[var(--primary-text)]
    if (line.includes('text-[var(--primary-text)]') && hasGradient(content, index)) {
      // Check if this is part of a button element (button, className, etc.)
      const isButtonContext =
        /<button/.test(lines.slice(Math.max(0, index - 5), index + 1).join('\n')) ||
        /className/.test(lines.slice(Math.max(0, index - 2), index + 2).join('\n'));

      if (isButtonContext) {
        const updatedLine = line.replace(/text-\[var\(--primary-text\)\]/g, 'text-[var(--button-active-text)]');
        if (updatedLine !== line) {
          const lineContent = newContent.split('\n');
          lineContent[index] = updatedLine;
          newContent = lineContent.join('\n');
          modified = true;
          changes.push({
            line: index + 1,
            original: line.trim().substring(0, 80) + (line.trim().length > 80 ? '...' : ''),
            updated: updatedLine.trim().substring(0, 80) + (updatedLine.trim().length > 80 ? '...' : ''),
          });
        }
      }
    }

    // Check for text-[var(--foreground)]
    if (line.includes('text-[var(--foreground)]') && hasGradient(content, index)) {
      // Check if this is part of a button element (button, className, etc.)
      const isButtonContext =
        /<button/.test(lines.slice(Math.max(0, index - 5), index + 1).join('\n')) ||
        /className/.test(lines.slice(Math.max(0, index - 2), index + 2).join('\n'));

      // Skip subtle gradients (opacity < 20%) - these might intentionally use foreground text
      const hasSubtleGradient = /from-\[var\([^)]+\)\]\/\d+/.test(line) &&
        /from-\[var\([^)]+\)\]\/(\d+)/.test(line) &&
        parseInt(/from-\[var\([^)]+\)\]\/(\d+)/.exec(line)?.[1] || '0') < 20;

      if (isButtonContext && !hasSubtleGradient) {
        const updatedLine = line.replace(/text-\[var\(--foreground\)\]/g, 'text-[var(--button-active-text)]');
        if (updatedLine !== line) {
          const lineContent = newContent.split('\n');
          lineContent[index] = updatedLine;
          newContent = lineContent.join('\n');
          modified = true;
          changes.push({
            line: index + 1,
            original: line.trim().substring(0, 80) + (line.trim().length > 80 ? '...' : ''),
            updated: updatedLine.trim().substring(0, 80) + (updatedLine.trim().length > 80 ? '...' : ''),
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
  console.log(`\n🔍 Button Text Migration Script`);
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
    console.log(`   node scripts/migrate-button-text.js --write\n`);
  } else {
    console.log(`\n✅ Changes applied successfully!\n`);
  }
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
