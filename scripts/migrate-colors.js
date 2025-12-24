#!/usr/bin/env node

/**
 * Color Migration Script
 *
 * Migrates hardcoded colors to CSS variables for theme support.
 * This is a simpler, more reliable approach than codemods for string replacements.
 *
 * Usage:
 *   npm run migrate:colors          # Preview changes (dry run)
 *   npm run migrate:colors:write     # Apply changes
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Color mapping - order matters (more specific patterns first)
const colorReplacements = [
  // Background colors with opacity (must come before exact matches)
  { pattern: /bg-\[#1f1f1f\]\/(\d+)/g, replacement: 'bg-[var(--surface)]/$1' },
  { pattern: /bg-\[#2a2a2a\]\/(\d+)/g, replacement: 'bg-[var(--muted)]/$1' },
  { pattern: /bg-\[#3a3a3a\]\/(\d+)/g, replacement: 'bg-[var(--surface-variant)]/$1' },
  { pattern: /bg-\[#0a0a0a\]\/(\d+)/g, replacement: 'bg-[var(--background)]/$1' },

  // Background colors exact
  { pattern: /bg-\[#0a0a0a\](?!\/)/g, replacement: 'bg-[var(--background)]' },
  { pattern: /bg-\[#1f1f1f\](?!\/)/g, replacement: 'bg-[var(--surface)]' },
  { pattern: /bg-\[#2a2a2a\](?!\/)/g, replacement: 'bg-[var(--muted)]' },
  { pattern: /bg-\[#3a3a3a\](?!\/)/g, replacement: 'bg-[var(--surface-variant)]' },
  { pattern: /\bbg-black\b(?!\/)/g, replacement: 'bg-[var(--background)]' },

  // Border colors with opacity
  { pattern: /border-\[#2a2a2a\]\/(\d+)/g, replacement: 'border-[var(--border)]/$1' },
  { pattern: /border-\[#3a3a3a\]\/(\d+)/g, replacement: 'border-[var(--border)]/$1' },

  // Border colors exact
  { pattern: /border-\[#2a2a2a\](?!\/)/g, replacement: 'border-[var(--border)]' },
  { pattern: /border-\[#3a3a3a\](?!\/)/g, replacement: 'border-[var(--border)]' },

  // Text colors with opacity
  { pattern: /text-white\/(\d+)/g, replacement: 'text-[var(--foreground)]/$1' },
  { pattern: /text-gray-300\/(\d+)/g, replacement: 'text-[var(--foreground-secondary)]/$1' },
  { pattern: /text-gray-400\/(\d+)/g, replacement: 'text-[var(--foreground-muted)]/$1' },
  { pattern: /text-gray-500\/(\d+)/g, replacement: 'text-[var(--foreground-subtle)]/$1' },

  // Text colors exact
  { pattern: /\btext-white\b(?!\/)/g, replacement: 'text-[var(--foreground)]' },
  { pattern: /\btext-gray-300\b(?!\/)/g, replacement: 'text-[var(--foreground-secondary)]' },
  { pattern: /\btext-gray-400\b(?!\/)/g, replacement: 'text-[var(--foreground-muted)]' },
  { pattern: /\btext-gray-500\b(?!\/)/g, replacement: 'text-[var(--foreground-subtle)]' },
  { pattern: /\btext-gray-600\b(?!\/)/g, replacement: 'text-[var(--foreground-subtle)]' },
  { pattern: /\btext-gray-700\b(?!\/)/g, replacement: 'text-[var(--foreground-muted)]' },

  // Border colors - gray variants
  { pattern: /\bborder-gray-500\b(?!\/)/g, replacement: 'border-[var(--border)]' },
  { pattern: /\bborder-gray-600\b(?!\/)/g, replacement: 'border-[var(--border)]' },

  // Background colors - additional hex values
  { pattern: /bg-\[#1a1a1a\](?!\/)/g, replacement: 'bg-[var(--surface)]' },

  // Border colors - gray variants (additional)
  { pattern: /\bborder-gray-700\b(?!\/)/g, replacement: 'border-[var(--border)]' },

  // Semantic Tailwind colors - success (green)
  { pattern: /\btext-green-400\b(?!\/)/g, replacement: 'text-[var(--color-success)]' },
  { pattern: /\btext-green-500\b(?!\/)/g, replacement: 'text-[var(--color-success)]' },
  { pattern: /\bbg-green-400\b(?!\/)/g, replacement: 'bg-[var(--color-success)]' },
  { pattern: /\bbg-green-500\b(?!\/)/g, replacement: 'bg-[var(--color-success)]' },
  { pattern: /\bborder-green-400\b(?!\/)/g, replacement: 'border-[var(--color-success)]' },
  { pattern: /\bborder-green-500\b(?!\/)/g, replacement: 'border-[var(--color-success)]' },

  // Semantic Tailwind colors - error (red)
  { pattern: /\btext-red-400\b(?!\/)/g, replacement: 'text-[var(--color-error)]' },
  { pattern: /\btext-red-500\b(?!\/)/g, replacement: 'text-[var(--color-error)]' },
  { pattern: /\bbg-red-400\b(?!\/)/g, replacement: 'bg-[var(--color-error)]' },
  { pattern: /\bbg-red-500\b(?!\/)/g, replacement: 'bg-[var(--color-error)]' },
  { pattern: /\bborder-red-400\b(?!\/)/g, replacement: 'border-[var(--color-error)]' },
  { pattern: /\bborder-red-500\b(?!\/)/g, replacement: 'border-[var(--color-error)]' },

  // Semantic Tailwind colors - warning (yellow/orange)
  { pattern: /\btext-yellow-400\b(?!\/)/g, replacement: 'text-[var(--color-warning)]' },
  { pattern: /\btext-yellow-500\b(?!\/)/g, replacement: 'text-[var(--color-warning)]' },
  { pattern: /\bbg-yellow-400\b(?!\/)/g, replacement: 'bg-[var(--color-warning)]' },
  { pattern: /\bbg-yellow-500\b(?!\/)/g, replacement: 'bg-[var(--color-warning)]' },
  { pattern: /\bborder-yellow-400\b(?!\/)/g, replacement: 'border-[var(--color-warning)]' },
  { pattern: /\bborder-yellow-500\b(?!\/)/g, replacement: 'border-[var(--color-warning)]' },

  // Semantic Tailwind colors - info (blue)
  { pattern: /\btext-blue-400\b(?!\/)/g, replacement: 'text-[var(--color-info)]' },
  { pattern: /\btext-blue-500\b(?!\/)/g, replacement: 'text-[var(--color-info)]' },
  { pattern: /\bbg-blue-400\b(?!\/)/g, replacement: 'bg-[var(--color-info)]' },
  { pattern: /\bbg-blue-500\b(?!\/)/g, replacement: 'bg-[var(--color-info)]' },
  { pattern: /\bborder-blue-400\b(?!\/)/g, replacement: 'border-[var(--color-info)]' },
  { pattern: /\bborder-blue-500\b(?!\/)/g, replacement: 'border-[var(--color-info)]' },

  // Semantic Tailwind colors with opacity - success (green)
  { pattern: /\bbg-green-400\/(\d+)/g, replacement: 'bg-[var(--color-success)]/$1' },
  { pattern: /\bbg-green-500\/(\d+)/g, replacement: 'bg-[var(--color-success)]/$1' },
  { pattern: /\bborder-green-400\/(\d+)/g, replacement: 'border-[var(--color-success)]/$1' },
  { pattern: /\bborder-green-500\/(\d+)/g, replacement: 'border-[var(--color-success)]/$1' },

  // Semantic Tailwind colors with opacity - error (red)
  { pattern: /\bbg-red-400\/(\d+)/g, replacement: 'bg-[var(--color-error)]/$1' },
  { pattern: /\bbg-red-500\/(\d+)/g, replacement: 'bg-[var(--color-error)]/$1' },
  { pattern: /\bborder-red-400\/(\d+)/g, replacement: 'border-[var(--color-error)]/$1' },
  { pattern: /\bborder-red-500\/(\d+)/g, replacement: 'border-[var(--color-error)]/$1' },

  // Semantic Tailwind colors with opacity - warning (yellow)
  { pattern: /\bbg-yellow-400\/(\d+)/g, replacement: 'bg-[var(--color-warning)]/$1' },
  { pattern: /\bbg-yellow-500\/(\d+)/g, replacement: 'bg-[var(--color-warning)]/$1' },
  { pattern: /\bborder-yellow-400\/(\d+)/g, replacement: 'border-[var(--color-warning)]/$1' },
  { pattern: /\bborder-yellow-500\/(\d+)/g, replacement: 'border-[var(--color-warning)]/$1' },

  // Semantic Tailwind colors with opacity - info (blue)
  { pattern: /\bbg-blue-400\/(\d+)/g, replacement: 'bg-[var(--color-info)]/$1' },
  { pattern: /\bbg-blue-500\/(\d+)/g, replacement: 'bg-[var(--color-info)]/$1' },
  { pattern: /\bborder-blue-400\/(\d+)/g, replacement: 'border-[var(--color-info)]/$1' },
  { pattern: /\bborder-blue-500\/(\d+)/g, replacement: 'border-[var(--color-info)]/$1' },

  // Background colors - white/black
  { pattern: /\bbg-white\b(?!\/)/g, replacement: 'bg-[var(--qr-background)]' }, // QR codes - can be manually adjusted if needed
  { pattern: /\bbg-black\b(?!\/)/g, replacement: 'bg-[var(--background)]' },

  // Text colors - black
  { pattern: /\btext-black\b(?!\/)/g, replacement: 'text-[var(--primary-text)]' }, // Buttons - can be manually adjusted if needed

  // Info color (#3B82F6 - blue) - must come before cyber carrot colors
  { pattern: /text-\[#3B82F6\]/g, replacement: 'text-[var(--color-info)]' },
  { pattern: /bg-\[#3B82F6\]/g, replacement: 'bg-[var(--color-info)]' },
  { pattern: /border-\[#3B82F6\]/g, replacement: 'border-[var(--color-info)]' },
  { pattern: /from-\[#3B82F6\]/g, replacement: 'from-[var(--color-info)]' },
  { pattern: /to-\[#3B82F6\]/g, replacement: 'to-[var(--color-info)]' },
  { pattern: /via-\[#3B82F6\]/g, replacement: 'via-[var(--color-info)]' },
  { pattern: /hover:border-\[#3B82F6\]/g, replacement: 'hover:border-[var(--color-info)]' },
  { pattern: /hover:text-\[#3B82F6\]/g, replacement: 'hover:text-[var(--color-info)]' },
  { pattern: /shadow-\[#3B82F6\]/g, replacement: 'shadow-[var(--color-info)]' },

  // Warning color (#F59E0B - orange/yellow) - must come before cyber carrot colors
  { pattern: /text-\[#F59E0B\]/g, replacement: 'text-[var(--color-warning)]' },
  { pattern: /bg-\[#F59E0B\]/g, replacement: 'bg-[var(--color-warning)]' },
  { pattern: /border-\[#F59E0B\]/g, replacement: 'border-[var(--color-warning)]' },
  { pattern: /from-\[#F59E0B\]/g, replacement: 'from-[var(--color-warning)]' },
  { pattern: /to-\[#F59E0B\]/g, replacement: 'to-[var(--color-warning)]' },
  { pattern: /via-\[#F59E0B\]/g, replacement: 'via-[var(--color-warning)]' },
  { pattern: /hover:border-\[#F59E0B\]/g, replacement: 'hover:border-[var(--color-warning)]' },
  { pattern: /hover:text-\[#F59E0B\]/g, replacement: 'hover:text-[var(--color-warning)]' },
  { pattern: /shadow-\[#F59E0B\]/g, replacement: 'shadow-[var(--color-warning)]' },

  // Tertiary color (#FF6B00 - cyber orange)
  { pattern: /text-\[#FF6B00\]/g, replacement: 'text-[var(--tertiary)]' },
  { pattern: /bg-\[#FF6B00\]/g, replacement: 'bg-[var(--tertiary)]' },
  { pattern: /border-\[#FF6B00\]/g, replacement: 'border-[var(--tertiary)]' },
  { pattern: /from-\[#FF6B00\]/g, replacement: 'from-[var(--tertiary)]' },
  { pattern: /to-\[#FF6B00\]/g, replacement: 'to-[var(--tertiary)]' },
  { pattern: /via-\[#FF6B00\]/g, replacement: 'via-[var(--tertiary)]' },
  { pattern: /hover:border-\[#FF6B00\]/g, replacement: 'hover:border-[var(--tertiary)]' },
  { pattern: /hover:text-\[#FF6B00\]/g, replacement: 'hover:text-[var(--tertiary)]' },
  { pattern: /shadow-\[#FF6B00\]/g, replacement: 'shadow-[var(--tertiary)]' },

  // Chart colors - semantic colors
  { pattern: /#22c55e/g, replacement: 'var(--color-success)' }, // Green
  { pattern: /#3b82f6/g, replacement: 'var(--color-info)' }, // Blue
  { pattern: /#f97316/g, replacement: 'var(--color-warning)' }, // Orange
  { pattern: /#ef4444/g, replacement: 'var(--color-error)' }, // Red

  // Additional gray colors for charts/strokes
  { pattern: /#2a2a2a/g, replacement: 'var(--muted)' },
  { pattern: /#9ca3af/g, replacement: 'var(--foreground-muted)' },

  // Cyber Carrot colors - must come after other patterns to avoid conflicts
  { pattern: /text-\[#29E7CD\]/g, replacement: 'text-[var(--primary)]' },
  { pattern: /text-\[#D925C7\]/g, replacement: 'text-[var(--accent)]' },
  { pattern: /border-\[#29E7CD\]/g, replacement: 'border-[var(--primary)]' },
  { pattern: /border-\[#D925C7\]/g, replacement: 'border-[var(--accent)]' },
  { pattern: /bg-\[#29E7CD\]/g, replacement: 'bg-[var(--primary)]' },
  { pattern: /bg-\[#D925C7\]/g, replacement: 'bg-[var(--accent)]' },
  { pattern: /from-\[#29E7CD\]/g, replacement: 'from-[var(--primary)]' },
  { pattern: /to-\[#D925C7\]/g, replacement: 'to-[var(--accent)]' },
  { pattern: /via-\[#29E7CD\]/g, replacement: 'via-[var(--primary)]' },
  { pattern: /via-\[#D925C7\]/g, replacement: 'via-[var(--accent)]' },
  { pattern: /hover:border-\[#29E7CD\]/g, replacement: 'hover:border-[var(--primary)]' },
  { pattern: /hover:text-\[#29E7CD\]/g, replacement: 'hover:text-[var(--primary)]' },
  { pattern: /focus:ring-\[#29E7CD\]/g, replacement: 'focus:ring-[var(--primary)]' },
  { pattern: /shadow-\[#29E7CD\]/g, replacement: 'shadow-[var(--primary)]' },
  {
    pattern: /focus:ring-offset-\[#0a0a0a\]/g,
    replacement: 'focus:ring-offset-[var(--background)]',
  },

  // Gradient patterns - must come after individual color patterns
  { pattern: /to-\[#29E7CD\]/g, replacement: 'to-[var(--primary)]' },
  { pattern: /from-\[#D925C7\]/g, replacement: 'from-[var(--accent)]' },
  { pattern: /to-\[#D925C7\]/g, replacement: 'to-[var(--accent)]' },
  { pattern: /hover:from-\[#D925C7\]/g, replacement: 'hover:from-[var(--accent)]' },
  { pattern: /hover:to-\[#29E7CD\]/g, replacement: 'hover:to-[var(--primary)]' },
];

/**
 * Replace colors in a string
 */
function replaceColors(content) {
  let newContent = content;
  let totalReplacements = 0;

  for (const { pattern, replacement } of colorReplacements) {
    const matches = newContent.match(pattern);
    if (matches) {
      totalReplacements += matches.length;
      if (replacement.includes('$1')) {
        // Has capture group - use function replacement
        newContent = newContent.replace(pattern, (match, p1) => {
          return replacement.replace('$1', p1);
        });
      } else {
        // Simple replacement
        newContent = newContent.replace(pattern, replacement);
      }
    }
  }

  return { newContent, totalReplacements };
}

/**
 * Process a single file
 */
function processFile(filePath, dryRun = true) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip if file doesn't have any color patterns
    if (
      !/text-white|bg-\[#|border-\[#|text-gray-|border-gray-|text-\[#29E7CD\]|text-\[#D925C7\]|text-\[#3B82F6\]|text-\[#F59E0B\]|text-\[#FF6B00\]|from-\[#29E7CD\]|to-\[#29E7CD\]|from-\[#D925C7\]|to-\[#D925C7\]|text-black|bg-white|bg-black|text-(red|green|blue|yellow|orange|purple|pink|cyan|indigo|violet|amber|emerald|lime|teal|sky|rose|fuchsia)-|bg-(red|green|blue|yellow|orange|purple|pink|cyan|indigo|violet|amber|emerald|lime|teal|sky|rose|fuchsia)-|border-(red|green|blue|yellow|orange|purple|pink|cyan|indigo|violet|amber|emerald|lime|teal|sky|rose|fuchsia)-|#22c55e|#3b82f6|#f97316|#ef4444|#2a2a2a|#9ca3af/.test(
        content,
      )
    ) {
      return { changed: false, replacements: 0 };
    }

    const { newContent, totalReplacements } = replaceColors(content);

    if (totalReplacements > 0 && newContent !== content) {
      if (!dryRun) {
        fs.writeFileSync(filePath, newContent, 'utf8');
      }
      return { changed: true, replacements: totalReplacements };
    }

    return { changed: false, replacements: 0 };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return { changed: false, replacements: 0, error: error.message };
  }
}

/**
 * Main function
 */
async function main() {
  const dryRun = !process.argv.includes('--write');
  const targetDirs = process.argv.includes('--dir')
    ? process.argv[process.argv.indexOf('--dir') + 1].split(',')
    : ['app/webapp', 'components'];

  console.log(`\n🎨 Color Migration Script`);
  console.log(`Mode: ${dryRun ? 'DRY RUN (preview only)' : 'WRITE MODE (applying changes)'}`);
  console.log(`Target directories: ${targetDirs.join(', ')}\n`);

  // Find all TypeScript/TSX files
  const patterns = targetDirs.map(dir => `${dir}/**/*.{ts,tsx}`);
  const files = await glob(patterns, {
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**'],
  });

  console.log(`Found ${files.length} files to process...\n`);

  let totalFilesChanged = 0;
  let totalReplacements = 0;
  const changedFiles = [];

  for (const file of files) {
    const result = processFile(file, dryRun);
    if (result.changed) {
      totalFilesChanged++;
      totalReplacements += result.replacements;
      changedFiles.push({ file, replacements: result.replacements });
      console.log(`  ✓ ${file} (${result.replacements} replacements)`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  Files changed: ${totalFilesChanged}`);
  console.log(`  Total replacements: ${totalReplacements}`);

  if (dryRun && totalFilesChanged > 0) {
    console.log(`\n💡 Run with --write to apply changes:`);
    console.log(`   npm run migrate:colors:write\n`);
  } else if (!dryRun) {
    console.log(`\n✅ Changes applied successfully!\n`);
  } else {
    console.log(`\n✅ No changes needed.\n`);
  }

  process.exit(totalFilesChanged > 0 ? 0 : 0);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
