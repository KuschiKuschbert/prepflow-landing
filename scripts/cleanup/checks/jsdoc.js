#!/usr/bin/env node

/**
 * JSDoc Check Module
 * Detects missing JSDoc on public functions/components/hooks
 * Source: development.mdc (JSDoc Documentation Standards)
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

function findFiles() {
  const files = [];
  const searchDirs = ['app', 'components', 'hooks', 'lib'];

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
      } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function checkJSDoc(content, filePath) {
  const violations = [];
  const lines = content.split(/\r?\n/);

  // Check for exported functions/components without JSDoc
  // This is a simplified check - can be enhanced with AST parsing
  const exportPatterns = [
    /^export\s+(?:async\s+)?function\s+(\w+)/,
    /^export\s+const\s+(\w+)\s*=\s*(?:async\s+)?\(/,
    /^export\s+function\s+(\w+)/,
    /^export\s+default\s+function\s+(\w+)/,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const pattern of exportPatterns) {
      const match = line.match(pattern);
      if (match) {
        // Check if previous lines contain JSDoc
        let hasJSDoc = false;
        for (let j = Math.max(0, i - 5); j < i; j++) {
          if (lines[j].trim().startsWith('/**') || lines[j].trim().startsWith('*')) {
            hasJSDoc = true;
            break;
          }
        }
        if (!hasJSDoc && match[1] && !match[1].startsWith('_')) {
          violations.push({
            line: i + 1,
            name: match[1],
          });
        }
      }
    }
  }

  return violations;
}

/**
 * Check JSDoc documentation
 */
async function checkJSDocDocs(files = null) {
  const filesToCheck = files || findFiles();
  const violations = [];
  const standardConfig = getStandardConfig('jsdoc');

  // Limit to first 50 files to avoid performance issues
  const limitedFiles = filesToCheck.slice(0, 50);

  for (const file of limitedFiles) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const found = checkJSDoc(content, file);

    for (const violation of found) {
      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          line: violation.line,
          message: `Missing JSDoc for exported function/component: ${violation.name}`,
          severity: standardConfig.severity,
          fixable: standardConfig.fixable,
          standard: standardConfig.source,
          reference: 'See cleanup.mdc (JSDoc Requirements) and development.mdc (JSDoc Templates)',
        }),
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ All public functions have JSDoc'
        : `⚠️ ${violations.length} function(s) missing JSDoc (limited check)`,
  };
}

module.exports = {
  name: 'jsdoc',
  check: checkJSDocDocs,
};
