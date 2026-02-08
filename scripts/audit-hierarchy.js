#!/usr/bin/env node

/**
 * Visual Hierarchy Audit Script
 *
 * Scans the codebase for visual hierarchy violations and generates a report.
 * Checks for typography, spacing, color, and component sizing inconsistencies.
 *
 * Usage:
 *   node scripts/audit-hierarchy.js [options]
 *
 * Options:
 *   --fix        Attempt to auto-fix violations (experimental)
 *   --json       Output results as JSON
 *   --verbose    Show detailed violation information
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  // Directories to scan
  scanDirs: ['app', 'components'],
  // File extensions to check
  extensions: ['.tsx', '.ts', '.jsx', '.js'],
  // Ignore patterns
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
  ],
};

// Violation patterns
const VIOLATIONS = {
  typography: {
    // Non-fluid typography sizes
    nonFluidTypography: {
      pattern: /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)(?!-fluid)/g,
      message: 'Non-fluid typography size detected. Use text-fluid-* instead.',
      severity: 'high',
    },
    // Inconsistent font weights
    inconsistentWeights: {
      pattern: /font-(light|normal|medium|semibold|bold)/g,
      message: 'Font weight may be inconsistent. Check hierarchy standards.',
      severity: 'medium',
    },
  },
  spacing: {
    // Non-standard spacing values
    nonStandardSpacing: {
      pattern: /(mb|mt|py|px|gap|space-y)-(1|2|3|4|5|6|7|8|10|12|16|20|24|32|48|64|96)/g,
      message: 'Spacing value may not follow 4px base unit scale.',
      severity: 'medium',
    },
    // Missing responsive spacing
    missingResponsive: {
      pattern: /(mb|mt|py|px)-(2|4|6|8)(?!\s+tablet:|desktop:)/g,
      message: 'Consider adding responsive spacing variants (tablet:, desktop:).',
      severity: 'low',
    },
  },
  color: {
    // Custom opacity values (should use semantic colors)
    customOpacity: {
      pattern: /text-\[var\(--foreground\)\]\/(\d+)/g,
      message: 'Custom opacity value detected. Use semantic color variables instead.',
      severity: 'high',
    },
    // Hardcoded colors
    hardcodedColors: {
      pattern: /text-(white|black|gray-\d+|red-\d+|blue-\d+|green-\d+)/g,
      message: 'Hardcoded color detected. Use CSS variables for theme support.',
      severity: 'medium',
    },
  },
  componentSizing: {
    // Non-standard button sizes
    nonStandardButton: {
      pattern: /(px-\d+ py-\d+)\s+(text-(xs|sm|base|lg))/g,
      message: 'Button sizing may not follow standard sizes. Check component sizing standards.',
      severity: 'medium',
    },
    // Non-standard card padding
    nonStandardCard: {
      pattern: /p-(1|2|3|5|7|9|10|11|12|14|16|20|24)(?!\s+tablet:|desktop:)/g,
      message: 'Card padding may not follow standard sizes. Use p-4, p-6, or p-8.',
      severity: 'medium',
    },
  },
};

// Statistics
const stats = {
  filesScanned: 0,
  violationsFound: 0,
  violationsByType: {},
  violationsBySeverity: { high: 0, medium: 0, low: 0 },
};

// Results storage
const results = {
  violations: [],
  summary: {},
};

/**
 * Check if file should be ignored
 */
function shouldIgnoreFile(filePath) {
  return CONFIG.ignorePatterns.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(filePath);
    }
    return filePath.includes(pattern);
  });
}

/**
 * Scan file for violations
 */
function scanFile(filePath) {
  if (shouldIgnoreFile(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];

  // Check each violation type
  Object.entries(VIOLATIONS).forEach(([category, patterns]) => {
    Object.entries(patterns).forEach(([name, config]) => {
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
        });
      }
    });
  });

  return violations;
}

/**
 * Scan directory recursively
 */
function scanDirectory(dirPath) {
  const files = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (shouldIgnoreFile(fullPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...scanDirectory(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (CONFIG.extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Generate summary statistics
 */
function generateSummary() {
  const summary = {
    totalFilesScanned: stats.filesScanned,
    totalViolations: stats.violationsFound,
    violationsByCategory: stats.violationsByType,
    violationsBySeverity: stats.violationsBySeverity,
    highPriorityFiles: [],
    recommendations: [],
  };

  // Group violations by file
  const violationsByFile = {};
  results.violations.forEach(v => {
    if (!violationsByFile[v.file]) {
      violationsByFile[v.file] = [];
    }
    violationsByFile[v.file].push(v);
  });

  // Find files with high-priority violations
  Object.entries(violationsByFile).forEach(([file, violations]) => {
    const highPriorityCount = violations.filter(v => v.severity === 'high').length;
    if (highPriorityCount > 0) {
      summary.highPriorityFiles.push({
        file,
        highPriorityCount,
        totalViolations: violations.length,
      });
    }
  });

  // Generate recommendations
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
  if (stats.violationsBySeverity.low > 0) {
    summary.recommendations.push(
      `Consider fixing ${stats.violationsBySeverity.low} low-priority violations`,
    );
  }

  return summary;
}

/**
 * Main audit function
 */
function runAudit() {
  console.log('🔍 Starting visual hierarchy audit...\n');

  // Scan all files
  const filesToScan = [];
  CONFIG.scanDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      filesToScan.push(...scanDirectory(fullPath));
    }
  });

  stats.filesScanned = filesToScan.length;
  console.log(`📁 Scanning ${stats.filesScanned} files...\n`);

  // Scan each file
  filesToScan.forEach(file => {
    const violations = scanFile(file);
    violations.forEach(violation => {
      results.violations.push(violation);
      stats.violationsFound++;

      // Update statistics
      if (!stats.violationsByType[violation.category]) {
        stats.violationsByType[violation.category] = 0;
      }
      stats.violationsByType[violation.category]++;
      stats.violationsBySeverity[violation.severity]++;
    });
  });

  // Generate summary
  results.summary = generateSummary();

  // Output results
  console.log('📊 Audit Results:\n');
  console.log(`Files Scanned: ${results.summary.totalFilesScanned}`);
  console.log(`Violations Found: ${results.summary.totalViolations}\n`);

  if (results.summary.totalViolations > 0) {
    console.log('Violations by Category:');
    Object.entries(results.summary.violationsByCategory).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
    console.log('\nViolations by Severity:');
    Object.entries(results.summary.violationsBySeverity).forEach(([severity, count]) => {
      console.log(`  ${severity}: ${count}`);
    });

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
    results.summary.recommendations.forEach(rec => {
      console.log(`  - ${rec}`);
    });
  } else {
    console.log('✅ No violations found! Your codebase follows hierarchy standards.');
  }

  return results;
}

// Run audit if executed directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const outputJson = args.includes('--json');
  const verbose = args.includes('--verbose');

  const results = runAudit();

  if (outputJson) {
    console.log('\n' + JSON.stringify(results, null, 2));
  }

  // Exit with error code if violations found
  process.exit(results.summary.totalViolations > 0 ? 1 : 0);
}

module.exports = { runAudit, scanFile, scanDirectory };
