#!/usr/bin/env node

/**
 * Visual Hierarchy Audit Script
 *
 * Scans the codebase for visual hierarchy violations. Rules are scoped by area:
 * - landing: strict (fluid typography required)
 * - webapp: flexible (text-xs, text-sm, text-gray-* allowed per design.mdc)
 *
 * Usage:
 *   node scripts/audit-hierarchy.js [options]
 *
 * Options:
 *   --scope=landing|webapp|all   Limit scan to scope (default: all)
 *   --json                       Output results as JSON
 *   --verbose                    Show detailed violation information
 *
 * @see docs/VISUAL_HIERARCHY_STANDARDS.md
 * @see .cursor/rules/design.mdc (source of truth)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  scanDirs: ['app', 'components'],
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

/** Paths that are landing scope (strict rules) */
const LANDING_PATTERNS = [/[\\/]app[\\/]components[\\/]landing[\\/]/, /[\\/]app[\\/]page\.tsx$/];

/** Paths that are webapp scope (flexible rules) */
const WEBAPP_PATTERNS = [/[\\/]app[\\/]webapp[\\/]/, /[\\/]app[\\/]api[\\/]/];

/**
 * Get file scope for scoped violation checks
 * @returns {'landing'|'webapp'|'shared'}
 */
function getFileScope(filePath) {
  const normalized = filePath.replace(/\//g, path.sep);
  if (LANDING_PATTERNS.some(p => p.test(normalized))) return 'landing';
  if (WEBAPP_PATTERNS.some(p => p.test(normalized))) return 'webapp';
  return 'shared';
}

// Violation patterns (scoped where applicable)
const VIOLATIONS = {
  typography: {
    // Non-fluid typography - ONLY in landing scope (webapp allows text-xs, text-sm, text-base)
    nonFluidTypography: {
      pattern: /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)(?!-fluid)/g,
      message: 'Non-fluid typography in landing scope. Use text-fluid-* for landing content.',
      severity: 'high',
      scope: 'landing', // only applies to landing
    },
    nonGeistFont: {
      pattern: /\bfont-serif\b/g,
      message: 'font-serif not in design system. Use font-sans (Geist) or font-mono for code.',
      severity: 'medium',
      scope: 'all',
    },
  },
  color: {
    customOpacity: {
      pattern: /text-\[var\(--foreground\)\]\/(\d+)/g,
      message: 'Custom opacity value detected. Use semantic color variables instead.',
      severity: 'high',
      scope: 'all',
    },
    // Hardcoded colors - only flag in landing; webapp allows text-white, text-gray-300, etc. per design.mdc
    hardcodedColors: {
      pattern: /text-(red-\d+|blue-\d+|green-\d+|indigo-\d+|purple-\d+|yellow-\d+|pink-\d+)/g,
      message: 'Non-Cyber Carrot color. Use theme tokens or Cyber Carrot palette.',
      severity: 'medium',
      scope: 'all',
    },
  },
  componentSizing: {
    // Non-standard card padding - narrow to truly non-standard (p-7, p-9, etc.)
    nonStandardCard: {
      pattern: /\bp-(1|2|3|7|9|10|11|14|16|20|24)\b(?!\s+tablet:|\s+desktop:)/g,
      message: 'Card padding may not follow standard sizes. Prefer p-4, p-6, p-8.',
      severity: 'medium',
      scope: 'all',
    },
    nonCyberCarrotButton: {
      pattern: /bg-gradient-to-r\s+from-(blue|green|red|indigo|purple|yellow|pink)-\d+/g,
      message:
        'Button gradient uses non-Cyber Carrot colors. Primary CTAs should use from-[#29E7CD] via-[#FF6B00] to-[#D925C7].',
      severity: 'medium',
      scope: 'all',
    },
  },
  icon: {
    // Direct Lucide usage without Icon wrapper - use <Icon icon={X} size="sm" /> instead
    directLucideUsage: {
      pattern:
        /<(ArrowLeft|ArrowRight|Edit2|Trash2|Save|X|Calendar|ClipboardList|Plus|Search|Mail|Phone|Building|CalendarIcon|Loader2|Users|ChevronLeft|ChevronRight|Clock|FileDown|Sparkles|Camera|Download|Info|Copy|ExternalLink|RefreshCw|RotateCw|DollarSign|TrendingUp|Trophy|Share2|Utensils|ChefHat|Check|MoreVertical|LayoutTemplate|Monitor)\s+(className=|size=)/g,
      message:
        'Lucide icon used directly. Use Icon wrapper: <Icon icon={X} size="sm" /> for consistent sizing and accessibility.',
      severity: 'medium',
      scope: 'all',
    },
    // Emoji icons - use Lucide icons instead per design.mdc
    emojiIcons: {
      pattern: /[✨🏪📍📊📋🎯⚡👍🗑️]/g,
      message: 'Emoji icon detected. Use Lucide icons with Icon wrapper per design system.',
      severity: 'medium',
      scope: 'all',
    },
  },
};

const stats = {
  filesScanned: 0,
  violationsFound: 0,
  violationsByType: {},
  violationsBySeverity: { high: 0, medium: 0, low: 0 },
};
const results = { violations: [], summary: {} };

function shouldIgnoreFile(filePath) {
  return CONFIG.ignorePatterns.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(filePath);
    }
    return filePath.includes(pattern);
  });
}

function shouldCheckViolation(fileScope, violationScope, cliScope) {
  if (violationScope === 'all') {
    if (cliScope === 'landing') return fileScope === 'landing';
    if (cliScope === 'webapp') return fileScope === 'webapp';
    return true;
  }
  if (violationScope === 'landing' && fileScope !== 'landing') return false;
  if (cliScope === 'landing') return fileScope === 'landing';
  if (cliScope === 'webapp') return fileScope === 'webapp';
  return true;
}

function scanFile(filePath, cliScope = 'all') {
  if (shouldIgnoreFile(filePath)) return [];

  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];
  const fileScope = getFileScope(filePath);

  Object.entries(VIOLATIONS).forEach(([category, patterns]) => {
    Object.entries(patterns).forEach(([name, config]) => {
      if (!shouldCheckViolation(fileScope, config.scope || 'all', cliScope)) return;

      const matches = content.matchAll(config.pattern);
      for (const match of matches) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        violations.push({
          file: filePath,
          line: lineNumber,
          category,
          type: name,
          severity: config.severity,
          message: config.message,
          match: match[0],
          scope: fileScope,
        });
      }
    });
  });

  return violations;
}

function scanDirectory(dirPath) {
  const files = [];
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

function generateSummary() {
  const violationsByScope = { landing: 0, webapp: 0, shared: 0 };
  results.violations.forEach(v => {
    if (violationsByScope[v.scope] !== undefined) violationsByScope[v.scope]++;
  });

  const summary = {
    totalFilesScanned: stats.filesScanned,
    totalViolations: stats.violationsFound,
    violationsByCategory: stats.violationsByType,
    violationsBySeverity: stats.violationsBySeverity,
    violationsByScope,
    highPriorityFiles: [],
    recommendations: [],
    acceptedPatterns: [
      'Webapp: text-xs, text-sm, text-base, text-gray-300, text-white (per design.mdc)',
      'Landing: text-fluid-* required',
      'Standard spacing: mb-*, gap-*, p-4, p-6, p-8',
    ],
  };

  const violationsByFile = {};
  results.violations.forEach(v => {
    if (!violationsByFile[v.file]) violationsByFile[v.file] = [];
    violationsByFile[v.file].push(v);
  });

  Object.entries(violationsByFile).forEach(([file, violations]) => {
    const highCount = violations.filter(v => v.severity === 'high').length;
    if (highCount > 0) {
      summary.highPriorityFiles.push({
        file,
        highPriorityCount: highCount,
        totalViolations: violations.length,
      });
    }
  });

  if (stats.violationsBySeverity.high > 0) {
    summary.recommendations.push(
      `Fix ${stats.violationsBySeverity.high} high-priority violations first`,
    );
  }
  if (stats.violationsBySeverity.medium > 0) {
    summary.recommendations.push(
      `Address ${stats.violationsBySeverity.medium} medium-priority violations`,
    );
  }

  return summary;
}

function runAudit(cliScope = 'all') {
  console.log('🔍 Starting visual hierarchy audit...\n');
  if (cliScope !== 'all') {
    console.log(`📂 Scope: ${cliScope} only\n`);
  }

  const filesToScan = [];
  CONFIG.scanDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) filesToScan.push(...scanDirectory(fullPath));
  });

  const filteredFiles =
    cliScope === 'all' ? filesToScan : filesToScan.filter(f => getFileScope(f) === cliScope);
  stats.filesScanned = filteredFiles.length;
  console.log(`📁 Scanning ${stats.filesScanned} files...\n`);

  filteredFiles.forEach(file => {
    const violations = scanFile(file, cliScope);
    violations.forEach(v => {
      results.violations.push(v);
      stats.violationsFound++;
      stats.violationsByType[v.category] = (stats.violationsByType[v.category] || 0) + 1;
      stats.violationsBySeverity[v.severity]++;
    });
  });

  results.summary = generateSummary();

  console.log('📊 Audit Results:\n');
  console.log(`Files Scanned: ${results.summary.totalFilesScanned}`);
  console.log(`Violations Found: ${results.summary.totalViolations}\n`);

  if (results.summary.totalViolations > 0) {
    console.log('Violations by Category:');
    Object.entries(results.summary.violationsByCategory).forEach(([cat, count]) =>
      console.log(`  ${cat}: ${count}`),
    );
    console.log('\nViolations by Severity:');
    Object.entries(results.summary.violationsBySeverity).forEach(([sev, count]) =>
      console.log(`  ${sev}: ${count}`),
    );
    if (cliScope === 'all' && Object.values(results.summary.violationsByScope).some(c => c > 0)) {
      console.log('\nViolations by Scope:');
      Object.entries(results.summary.violationsByScope)
        .filter(([, c]) => c > 0)
        .forEach(([scope, count]) => console.log(`  ${scope}: ${count}`));
    }

    if (results.summary.highPriorityFiles.length > 0) {
      console.log('\n⚠️  High-Priority Files:');
      results.summary.highPriorityFiles
        .slice(0, 10)
        .forEach(({ file, highPriorityCount, totalViolations }) => {
          console.log(`  ${file}: ${highPriorityCount} high-priority, ${totalViolations} total`);
        });
      if (results.summary.highPriorityFiles.length > 10) {
        console.log(`  ... and ${results.summary.highPriorityFiles.length - 10} more files`);
      }
    }

    console.log('\n💡 Recommendations:');
    results.summary.recommendations.forEach(rec => console.log(`  - ${rec}`));
  } else {
    console.log('✅ No violations found! Codebase follows scoped hierarchy standards.');
    console.log('\nAccepted patterns:');
    results.summary.acceptedPatterns.forEach(p => console.log(`  - ${p}`));
  }

  return results;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const scopeArg = args.find(a => a.startsWith('--scope='));
  const cliScope = scopeArg ? scopeArg.split('=')[1] : 'all';
  const outputJson = args.includes('--json');

  const validScopes = ['landing', 'webapp', 'all'];
  if (!validScopes.includes(cliScope)) {
    console.error(`Invalid --scope. Use: ${validScopes.join(', ')}`);
    process.exit(1);
  }

  const results = runAudit(cliScope);

  if (outputJson) {
    console.log('\n' + JSON.stringify(results, null, 2));
  }

  process.exit(results.summary.totalViolations > 0 ? 1 : 0);
}

module.exports = { runAudit, scanFile, scanDirectory, getFileScope };
