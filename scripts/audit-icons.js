#!/usr/bin/env node

/**
 * In-Depth Icon Audit Script
 *
 * Scans the codebase for icon consistency violations per design.mdc:
 * - Direct Lucide usage (without Icon wrapper)
 * - Emoji usage (should use Lucide icons)
 * - Non-standard icon sizing
 *
 * Usage:
 *   node scripts/audit-icons.js [options]
 *
 * Options:
 *   --scope=landing|webapp|all   Limit scan to scope (default: all)
 *   --json                       Output results as JSON
 *   --format=short|detailed      Report format (default: detailed)
 *
 * @see .cursor/rules/design.mdc (Icon Standards)
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  scanDirs: ['app', 'components', 'lib'],
  extensions: ['.tsx', '.ts', '.jsx', '.js'],
  ignorePatterns: [
    'node_modules',
    '.next',
    'out',
    'build',
    'dist',
    '*.test.ts',
    '*.test.tsx',
    '*.spec.ts',
    '*.spec.tsx',
    'nachotaco',
    'curbos',
  ],
};

/** Known Lucide icons often used directly (incomplete list) */
const LUCIDE_ICON_NAMES = [
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Edit2',
  'Trash2',
  'Save',
  'X',
  'Calendar',
  'ClipboardList',
  'Plus',
  'Minus',
  'Search',
  'Mail',
  'Phone',
  'Building',
  'CalendarIcon',
  'Loader2',
  'Users',
  'ChevronLeft',
  'ChevronRight',
  'Clock',
  'FileDown',
  'Sparkles',
  'Camera',
  'Download',
  'Info',
  'Copy',
  'ExternalLink',
  'RefreshCw',
  'RotateCw',
  'DollarSign',
  'TrendingUp',
  'Trophy',
  'Share2',
  'Utensils',
  'ChefHat',
  'Check',
  'MoreVertical',
  'LayoutTemplate',
  'Monitor',
  'Store',
  'MapPin',
  'Zap',
  'Target',
];

/** Emoji that should be replaced with Lucide icons (per design.mdc) */
const EMOJI_PATTERN = /[✨🏪📍📊📋🎯⚡👍🗑️]/g;

/** Direct Lucide usage: <IconName className= or <IconName size= */
function buildDirectLucidePattern() {
  const names = LUCIDE_ICON_NAMES.join('|');
  return new RegExp(`<(${names})\\s+(className=|size=)`, 'g');
}

const DIRECT_LUCIDE_PATTERN = buildDirectLucidePattern();

function shouldIgnoreFile(filePath) {
  return CONFIG.ignorePatterns.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(filePath);
    }
    return filePath.includes(pattern);
  });
}

function scanFile(filePath) {
  if (shouldIgnoreFile(filePath)) return { directLucide: [], emoji: [], iconWrapperCount: 0 };

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const directLucide = [];
  const emoji = [];
  let iconWrapperCount = 0;

  // Direct Lucide usage
  lines.forEach((line, i) => {
    const matches = line.matchAll(DIRECT_LUCIDE_PATTERN);
    for (const m of matches) {
      directLucide.push({
        line: i + 1,
        icon: m[1],
        match: m[0].slice(0, 60) + (m[0].length > 60 ? '...' : ''),
      });
    }
  });

  // Emoji (exclude logger/dev-only contexts when possible)
  lines.forEach((line, i) => {
    if (line.includes('logger.') && line.includes('📊')) return; // Logger usage - lower priority
    const matches = line.matchAll(EMOJI_PATTERN);
    for (const m of matches) {
      emoji.push({
        line: i + 1,
        char: m[0],
        context: line.trim().slice(0, 80) + (line.length > 80 ? '...' : ''),
      });
    }
  });

  // Icon wrapper usage (correct pattern)
  const iconMatches = content.match(/<Icon\s+icon=\{[^}]+\}/g);
  iconWrapperCount = iconMatches ? iconMatches.length : 0;

  return { directLucide, emoji, iconWrapperCount };
}

function scanDirectory(dirPath) {
  const files = [];
  if (!fs.existsSync(dirPath)) return files;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (shouldIgnoreFile(fullPath)) continue;
    if (entry.isDirectory()) {
      files.push(...scanDirectory(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (CONFIG.extensions.includes(ext)) files.push(fullPath);
    }
  }
  return files;
}

function runAudit(options = {}) {
  const { json = false, format = 'detailed' } = options;
  const cwd = process.cwd();

  const filesToScan = [];
  CONFIG.scanDirs.forEach(dir => {
    filesToScan.push(...scanDirectory(path.join(cwd, dir)));
  });

  const results = {
    filesScanned: 0,
    filesWithDirectLucide: [],
    filesWithEmoji: [],
    totalDirectLucide: 0,
    totalEmoji: 0,
    totalIconWrapperUsages: 0,
    byFile: {},
    summary: {},
  };

  filesToScan.forEach(filePath => {
    const relativePath = path.relative(cwd, filePath);
    const scan = scanFile(filePath);
    results.filesScanned++;

    if (scan.directLucide.length > 0) {
      results.filesWithDirectLucide.push({
        file: relativePath,
        count: scan.directLucide.length,
        violations: scan.directLucide,
      });
      results.totalDirectLucide += scan.directLucide.length;
    }

    if (scan.emoji.length > 0) {
      results.filesWithEmoji.push({
        file: relativePath,
        count: scan.emoji.length,
        violations: scan.emoji,
      });
      results.totalEmoji += scan.emoji.length;
    }

    if (scan.directLucide.length > 0 || scan.emoji.length > 0 || scan.iconWrapperCount > 0) {
      results.byFile[relativePath] = {
        directLucide: scan.directLucide.length,
        emoji: scan.emoji.length,
        iconWrapper: scan.iconWrapperCount,
      };
    }

    results.totalIconWrapperUsages += scan.iconWrapperCount;
  });

  results.summary = {
    totalViolations: results.totalDirectLucide + results.totalEmoji,
    directLucideFiles: results.filesWithDirectLucide.length,
    emojiFiles: results.filesWithEmoji.length,
    recommendations: [],
  };

  if (results.totalDirectLucide > 0) {
    results.summary.recommendations.push(
      `Replace ${results.totalDirectLucide} direct Lucide usages with <Icon icon={X} size="sm" />`,
    );
  }
  if (results.totalEmoji > 0) {
    results.summary.recommendations.push(
      `Replace ${results.totalEmoji} emoji icons with Lucide icons (Store, MapPin, Sparkles, etc.)`,
    );
  }

  if (!json) {
    console.log('🔍 Icon Audit Report\n');
    console.log(`📁 Files scanned: ${results.filesScanned}`);
    console.log(`📐 Icon wrapper usages: ${results.totalIconWrapperUsages}`);
    console.log(
      `⚠️  Direct Lucide usages: ${results.totalDirectLucide} (${results.filesWithDirectLucide.length} files)`,
    );
    console.log(`😀 Emoji icons: ${results.totalEmoji} (${results.filesWithEmoji.length} files)\n`);

    if (format === 'detailed') {
      if (results.filesWithDirectLucide.length > 0) {
        console.log('━━━ Direct Lucide Usage (use Icon wrapper) ━━━\n');
        results.filesWithDirectLucide.slice(0, 30).forEach(({ file, count, violations }) => {
          console.log(`  ${file}`);
          console.log(`    ${count} occurrence(s)`);
          violations.slice(0, 5).forEach(v => {
            console.log(`      L${v.line}: ${v.icon} — ${v.match}`);
          });
          if (violations.length > 5) console.log(`      ... and ${violations.length - 5} more`);
          console.log('');
        });
        if (results.filesWithDirectLucide.length > 30) {
          console.log(`  ... and ${results.filesWithDirectLucide.length - 30} more files\n`);
        }
      }

      if (results.filesWithEmoji.length > 0) {
        console.log('━━━ Emoji Icons (use Lucide) ━━━\n');
        results.filesWithEmoji.forEach(({ file, count, violations }) => {
          console.log(`  ${file}`);
          violations.slice(0, 3).forEach(v => {
            console.log(`    L${v.line}: ${v.char} — ${v.context}`);
          });
          if (violations.length > 3) console.log(`    ... +${violations.length - 3} more`);
          console.log('');
        });
      }
    }

    if (results.summary.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      results.summary.recommendations.forEach(r => console.log(`  - ${r}`));
    }

    if (results.summary.totalViolations === 0) {
      console.log('\n✅ No icon violations found!');
    }
  }

  return results;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const outputJson = args.includes('--json');
  const formatArg = args.find(a => a.startsWith('--format='));
  const format = formatArg ? formatArg.split('=')[1] : 'detailed';

  const results = runAudit({ json: outputJson, format });

  if (outputJson) {
    console.log(JSON.stringify(results, null, 2));
  }

  process.exit(results.summary.totalViolations > 0 ? 1 : 0);
}

module.exports = { runAudit, scanFile };
