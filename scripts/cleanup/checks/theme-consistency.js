#!/usr/bin/env node

/**
 * Theme Consistency Check Module
 * Detects hardcoded light/dark colors that break theme switching
 * Source: design.mdc (Cyber Carrot Design System)
 *
 * Components should use semantic tokens: bg-background, text-foreground, etc.
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

// Patterns that break theme - only standalone (exclude bg-white/50, bg-black/50 overlays)
const THEME_BREAKING_PATTERNS = [
  {
    pattern: /\bbg-white\b(?!\/)/g,
    message: 'Hardcoded bg-white breaks dark mode. Use bg-background or theme tokens.',
  },
  {
    pattern: /\bbg-black\b(?!\/)/g,
    message: 'Hardcoded bg-black breaks light mode. Use bg-background or theme tokens.',
  },
];

function extractThemeViolations(content) {
  const violations = [];
  for (const { pattern, message } of THEME_BREAKING_PATTERNS) {
    const re = new RegExp(pattern.source, 'g');
    let match;
    while ((match = re.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      violations.push({ line: lineNumber, message, match: match[0] });
    }
  }
  return violations;
}

function findFiles() {
  const files = [];
  const searchDirs = ['app', 'components'];

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          walkDir(fullPath);
        }
      } else if (/\.(tsx|jsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

/**
 * Check theme consistency
 */
async function checkThemeConsistency(files = null) {
  const filesToCheck = files || findFiles();
  const violations = [];
  const standardConfig = getStandardConfig('theme-consistency') || {
    severity: 'warning',
    fixable: false,
    source: 'design.mdc#cyber-carrot-design-system',
  };

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const found = extractThemeViolations(content);

    for (const v of found) {
      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          line: v.line,
          message: v.message,
          severity: standardConfig.severity,
          fixable: standardConfig.fixable,
          standard: standardConfig.source,
          reference: 'Use bg-background, text-foreground, or CSS variables for theme support',
        }),
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ No theme-breaking hardcoded colors found'
        : `❌ ${violations.length} theme consistency violation(s) found`,
  };
}

module.exports = {
  name: 'theme-consistency',
  check: checkThemeConsistency,
};
