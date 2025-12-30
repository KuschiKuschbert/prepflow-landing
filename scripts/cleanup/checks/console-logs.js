#!/usr/bin/env node

/**
 * Console.log Check Module
 * Detects console.log usage that should be migrated to logger
 * Source: development.mdc (Console Migration Codemod)
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

const CONSOLE_METHODS = ['log', 'error', 'warn', 'info', 'debug'];

function findFiles() {
  const files = [];
  const searchDirs = ['app', 'components', 'lib', 'hooks'];

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
        // Exclude logger.ts (intentional console usage)
        // Exclude cleanup scripts and protect-curbos - they're utility scripts
        if (
          !fullPath.includes('lib/logger.ts') &&
          !fullPath.includes('scripts/cleanup/') &&
          !fullPath.includes('scripts/protect-curbos.js')
        ) {
          files.push(fullPath);
        }
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function findConsoleUsage(content) {
  const violations = [];
  const lines = content.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip if this is in a script tag with documented exception (see ERROR_HANDLING_STANDARDS.md)
    // Check if previous lines contain the exception comment pattern
    const hasExceptionComment =
      i > 0 &&
      (lines[i - 1].includes('logger is not available in script tag') ||
        lines[i - 2]?.includes('logger is not available in script tag') ||
        lines[i - 3]?.includes('logger is not available in script tag'));

    // Skip console.error/console.warn in script tags with documented exception
    if (hasExceptionComment && (line.includes('console.error') || line.includes('console.warn'))) {
      continue;
    }

    for (const method of CONSOLE_METHODS) {
      const regex = new RegExp(`console\\.${method}\\s*\\(`, 'g');
      let match;
      while ((match = regex.exec(line)) !== null) {
        violations.push({
          line: i + 1,
          column: match.index + 1,
          method,
        });
      }
    }
  }

  return violations;
}

/**
 * Check console.log usage
 */
async function checkConsoleLogs(files = null) {
  const filesToCheck = files || findFiles();
  const violations = [];
  const standardConfig = getStandardConfig('console-logs');

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const found = findConsoleUsage(content);

    for (const violation of found) {
      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          line: violation.line,
          column: violation.column,
          message: `console.${violation.method}() should be migrated to logger.${violation.method === 'log' ? 'dev' : violation.method}()`,
          severity: standardConfig.severity,
          fixable: standardConfig.fixable,
          standard: standardConfig.source,
          reference: 'See cleanup.mdc (Console.log Migration) - use cleanup:fix to auto-migrate',
        }),
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ No console.log usage found'
        : `❌ ${violations.length} console.log usage(s) found (should use logger)`,
  };
}

module.exports = {
  name: 'console-logs',
  check: checkConsoleLogs,
};
