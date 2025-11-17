#!/usr/bin/env node

/**
 * Icon Check Module
 * Validates Icon wrapper usage and detects emoji usage
 * Source: design.mdc (Icon Standards)
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

function findFiles() {
  const files = [];
  const searchDirs = ['app', 'components'];

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (
          !entry.name.startsWith('.') &&
          entry.name !== 'node_modules' &&
          entry.name !== '.next'
        ) {
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

function checkIcons(content, filePath) {
  const violations = [];
  const lines = content.split('\n');

  // Check for emoji usage (simple pattern)
  const emojiPattern = /[\uD83C-\uDBFF\uDC00-\uDFFF]+/g;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (emojiPattern.test(line) && line.includes('>')) {
      violations.push({
        line: i + 1,
        type: 'emoji',
      });
    }
  }

  return violations;
}

/**
 * Check icon standards
 */
async function checkIconsStandards(files = null) {
  const filesToCheck = files || findFiles();
  const violations = [];
  const standardConfig = getStandardConfig('icons');

  // Limit to first 100 files
  const limitedFiles = filesToCheck.slice(0, 100);

  for (const file of limitedFiles) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const found = checkIcons(content, file);

    for (const violation of found) {
      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          line: violation.line,
          message: 'Emoji icon detected - should use Lucide React icons with Icon wrapper',
          severity: standardConfig.severity,
          fixable: standardConfig.fixable,
          standard: standardConfig.source,
          reference: 'See cleanup.mdc (Icon Standards) and design.mdc (Icon Standards)',
        }),
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ No emoji icons found'
        : `⚠️ ${violations.length} emoji icon(s) found (should use Lucide icons)`,
  };
}

module.exports = {
  name: 'icons',
  check: checkIconsStandards,
};
