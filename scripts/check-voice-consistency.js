#!/usr/bin/env node

/**
 * PrepFlow Voice Consistency Check
 * Scans all user-facing text for consistency with PrepFlow's cheeky kitchen language
 * Source: .cursor/rules/dialogs.mdc and development.mdc (PrepFlow Voice Guidelines)
 */

const fs = require('fs');
const path = require('path');

// Voice guidelines patterns
const VOICE_PATTERNS = {
  // Missing contractions (should use contractions)
  missingContractions: [
    { pattern: /\bcannot\b/gi, fix: "can't", severity: 'warning' },
    { pattern: /\bwill not\b/gi, fix: "won't", severity: 'warning' },
    { pattern: /\byou will\b/gi, fix: "you'll", severity: 'warning' },
    { pattern: /\bit is\b/gi, fix: "it's", severity: 'info' },
    { pattern: /\bthat is\b/gi, fix: "that's", severity: 'info' },
    { pattern: /\bthere is\b/gi, fix: "there's", severity: 'info' },
    { pattern: /\bdo not\b/gi, fix: "don't", severity: 'warning' },
    { pattern: /\bdoes not\b/gi, fix: "doesn't", severity: 'warning' },
    { pattern: /\bdid not\b/gi, fix: "didn't", severity: 'warning' },
    { pattern: /\bhave not\b/gi, fix: "haven't", severity: 'warning' },
    { pattern: /\bhas not\b/gi, fix: "hasn't", severity: 'warning' },
    { pattern: /\bshould not\b/gi, fix: "shouldn't", severity: 'warning' },
    { pattern: /\bcould not\b/gi, fix: "couldn't", severity: 'warning' },
    { pattern: /\bwould not\b/gi, fix: "wouldn't", severity: 'warning' },
  ],

  // Generic messages (should be more PrepFlow-specific)
  genericMessages: [
    {
      pattern: /\bAre you sure\?/gi,
      suggestion: 'Use PrepFlow voice with kitchen metaphors',
      severity: 'warning',
    },
    {
      pattern: /\bOperation failed\b/gi,
      suggestion: 'Be more specific about what failed',
      severity: 'warning',
    },
    {
      pattern: /\bError occurred\b/gi,
      suggestion: 'Describe the error in PrepFlow voice',
      severity: 'warning',
    },
    { pattern: /\bPlease try again\b/gi, suggestion: 'Add PrepFlow personality', severity: 'info' },
  ],

  // Technical jargon (should be avoided)
  technicalJargon: [
    {
      pattern: /\bentity\b/gi,
      suggestion: "Use 'item', 'ingredient', 'recipe', etc.",
      severity: 'warning',
    },
    { pattern: /\bdatabase\b/gi, suggestion: 'Avoid technical terms', severity: 'info' },
    { pattern: /\bAPI\b/gi, suggestion: 'Avoid technical terms', severity: 'info' },
    { pattern: /\bendpoint\b/gi, suggestion: 'Avoid technical terms', severity: 'info' },
    { pattern: /\bquery\b/gi, suggestion: "Use 'search' or 'find'", severity: 'info' },
  ],

  // Overly formal language
  overlyFormal: [
    {
      pattern: /\bPlease be advised that\b/gi,
      suggestion: 'Use more casual PrepFlow voice',
      severity: 'info',
    },
    {
      pattern: /\bIt is recommended that\b/gi,
      suggestion: 'Use more casual PrepFlow voice',
      severity: 'info',
    },
  ],
};

// Patterns to identify user-facing strings
const USER_FACING_PATTERNS = [
  // Notification calls
  /(showSuccess|showError|showWarning|showInfo|showAlert)\(['"`]([^'"`]+)['"`]\)/gi,
  // Dialog props
  /(title|message|confirmLabel|cancelLabel|placeholder):\s*['"`]([^'"`]+)['"`]/gi,
  // JSX text content (between tags)
  />\s*([^<{]+?)\s*</g,
  // String literals in user-facing contexts
  /(aria-label|aria-describedby|placeholder|title|alt)=['"`]([^'"`]+)['"`]/gi,
  // Empty state messages
  /(empty|no.*found|no.*available)[^'"]*['"`]([^'"`]+)['"`]/gi,
];

/**
 * Check if file should be excluded from voice check
 */
function shouldExcludeFile(filePath) {
  const excludePatterns = [
    /node_modules/,
    /\.next/,
    /out/,
    /build/,
    /dist/,
    /\.test\.tsx?$/,
    /\.spec\.tsx?$/,
    /\.d\.ts$/,
    /scripts\//,
    /migrations\//,
    /\.config\./,
    /jest\./,
    /\/api\/test\//, // Exclude test API endpoints (diagnostic/internal)
  ];

  return excludePatterns.some(pattern => pattern.test(filePath));
}

/**
 * Extract user-facing strings from file content
 */
function extractUserFacingStrings(content, filePath) {
  const strings = [];
  const lines = content.split('\n');

  // Check notification calls
  const notificationPattern =
    /(showSuccess|showError|showWarning|showInfo|showAlert)\(['"`]([^'"`]+)['"`]\)/gi;
  let match;
  while ((match = notificationPattern.exec(content)) !== null) {
    const lineNum = content.substring(0, match.index).split('\n').length;
    strings.push({
      text: match[2],
      line: lineNum,
      type: 'notification',
      context: match[1],
    });
  }

  // Check dialog props
  const dialogPattern =
    /(title|message|confirmLabel|cancelLabel|placeholder):\s*['"`]([^'"`]+)['"`]/gi;
  while ((match = dialogPattern.exec(content)) !== null) {
    const lineNum = content.substring(0, match.index).split('\n').length;
    strings.push({
      text: match[2],
      line: lineNum,
      type: 'dialog',
      context: match[1],
    });
  }

  // Check JSX text content (simple cases)
  const jsxPattern = />\s*([A-Z][^<{]{10,}?)\s*</g;
  while ((match = jsxPattern.exec(content)) !== null) {
    const text = match[1].trim();
    // Skip if it's just whitespace or very short
    if (text.length > 10 && !text.match(/^\s*$/)) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      strings.push({
        text: text,
        line: lineNum,
        type: 'jsx',
        context: 'text content',
      });
    }
  }

  // Check aria labels and placeholders
  const ariaPattern =
    /(aria-label|aria-describedby|placeholder|title|alt)=['"`]([^'"`]{5,})['"`]/gi;
  while ((match = ariaPattern.exec(content)) !== null) {
    const lineNum = content.substring(0, match.index).split('\n').length;
    strings.push({
      text: match[2],
      line: lineNum,
      type: 'accessibility',
      context: match[1],
    });
  }

  return strings;
}

/**
 * Check string against voice guidelines
 */
function checkStringAgainstVoice(text, filePath, line) {
  const violations = [];

  // Check for missing contractions
  for (const rule of VOICE_PATTERNS.missingContractions) {
    if (rule.pattern.test(text)) {
      violations.push({
        type: 'missing-contraction',
        text: text,
        rule: rule,
        suggestion: `Consider using "${rule.fix}" instead`,
        severity: rule.severity,
      });
    }
  }

  // Check for generic messages
  for (const rule of VOICE_PATTERNS.genericMessages) {
    if (rule.pattern.test(text)) {
      violations.push({
        type: 'generic-message',
        text: text,
        rule: rule,
        suggestion: rule.suggestion,
        severity: rule.severity,
      });
    }
  }

  // Check for technical jargon
  for (const rule of VOICE_PATTERNS.technicalJargon) {
    if (rule.pattern.test(text)) {
      violations.push({
        type: 'technical-jargon',
        text: text,
        rule: rule,
        suggestion: rule.suggestion,
        severity: rule.severity,
      });
    }
  }

  // Check for overly formal language
  for (const rule of VOICE_PATTERNS.overlyFormal) {
    if (rule.pattern.test(text)) {
      violations.push({
        type: 'overly-formal',
        text: text,
        rule: rule,
        suggestion: rule.suggestion,
        severity: rule.severity,
      });
    }
  }

  return violations;
}

/**
 * Find all TypeScript/TSX files
 */
function findFiles(rootDir = process.cwd()) {
  const files = [];

  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(rootDir, fullPath);

      if (entry.isDirectory()) {
        if (!shouldExcludeFile(relativePath)) {
          walkDir(fullPath);
        }
      } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
        if (!shouldExcludeFile(relativePath)) {
          files.push(relativePath);
        }
      }
    }
  }

  walkDir(rootDir);
  return files;
}

/**
 * Main check function
 */
function checkVoiceConsistency(files = null) {
  const violations = [];
  const filesToCheck = files || findFiles();

  for (const filePath of filesToCheck) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      const content = fs.readFileSync(fullPath, 'utf8');

      // Extract user-facing strings
      const strings = extractUserFacingStrings(content, filePath);

      // Check each string
      for (const str of strings) {
        const strViolations = checkStringAgainstVoice(str.text, filePath, str.line);
        for (const violation of strViolations) {
          violations.push({
            file: filePath,
            line: str.line,
            message: `${violation.type}: "${str.text}" - ${violation.suggestion}`,
            severity: violation.severity,
            fixable: violation.type === 'missing-contraction',
            text: str.text,
            violation: violation,
            stringType: str.type,
          });
        }
      }
    } catch (error) {
      // Skip files that can't be read
      continue;
    }
  }

  return violations;
}

/**
 * Generate report
 */
function generateReport(violations) {
  const report = {
    total: violations.length,
    byType: {},
    bySeverity: {},
    files: {},
    timestamp: new Date().toISOString(),
  };

  for (const violation of violations) {
    // Count by type
    const type = violation.violation?.type || 'unknown';
    report.byType[type] = (report.byType[type] || 0) + 1;

    // Count by severity
    report.bySeverity[violation.severity] = (report.bySeverity[violation.severity] || 0) + 1;

    // Group by file
    if (!report.files[violation.file]) {
      report.files[violation.file] = [];
    }
    report.files[violation.file].push(violation);
  }

  return report;
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const files = args.length > 0 ? args : null;

  console.log('🔍 Checking PrepFlow voice consistency...\n');

  const violations = checkVoiceConsistency(files);
  const report = generateReport(violations);

  // Print summary
  console.log(`📊 Voice Consistency Report`);
  console.log(`========================`);
  console.log(`Total violations: ${report.total}`);
  console.log(`\nBy severity:`);
  for (const [severity, count] of Object.entries(report.bySeverity)) {
    console.log(`  ${severity}: ${count}`);
  }
  console.log(`\nBy type:`);
  for (const [type, count] of Object.entries(report.byType)) {
    console.log(`  ${type}: ${count}`);
  }

  // Print violations by file
  if (report.total > 0) {
    console.log(`\n⚠️  Violations Found:\n`);
    for (const [file, fileViolations] of Object.entries(report.files)) {
      console.log(`  ${file}:`);
      for (const violation of fileViolations.slice(0, 5)) {
        console.log(`    Line ${violation.line}: ${violation.message}`);
      }
      if (fileViolations.length > 5) {
        console.log(`    ... and ${fileViolations.length - 5} more`);
      }
    }
  } else {
    console.log(`\n✅ No voice consistency violations found!`);
  }

  // Save JSON report
  const reportDir = path.join(process.cwd(), 'cleanup-reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportDir, `voice-consistency-${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report saved to: ${reportPath}`);

  process.exit(report.total > 0 ? 1 : 0);
}

module.exports = { checkVoiceConsistency, generateReport };
