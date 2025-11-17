#!/usr/bin/env node

/**
 * Unused Imports Check Module
 * Detects unused imports via ESLint
 * Source: development.mdc (Code Quality Standards)
 */

const { execSync } = require('child_process');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

/**
 * Check unused imports using ESLint
 */
async function checkUnusedImports(files = null) {
  const violations = [];
  const standardConfig = getStandardConfig('unused-imports');

  try {
    // Run ESLint with no-unused-vars rule
    const filesArg = files ? files.join(' ') : '.';
    const command = `npx eslint --format json --rule "no-unused-vars: error" ${filesArg} 2>/dev/null || true`;
    const output = execSync(command, { encoding: 'utf-8', cwd: process.cwd() });

    if (output) {
      try {
        const results = JSON.parse(output);
        for (const result of results) {
          for (const message of result.messages || []) {
            if (
              message.ruleId === 'no-unused-vars' ||
              message.ruleId === '@typescript-eslint/no-unused-vars'
            ) {
              violations.push(
                createViolation({
                  file: result.filePath,
                  line: message.line,
                  column: message.column,
                  message: `Unused import: ${message.message}`,
                  severity: standardConfig.severity,
                  fixable: standardConfig.fixable,
                  standard: standardConfig.source,
                  reference: 'See cleanup.mdc - use cleanup:fix to auto-remove',
                }),
              );
            }
          }
        }
      } catch (e) {
        // ESLint output might not be JSON if no violations
      }
    }
  } catch (error) {
    // ESLint might not be available or might error - that's okay
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ No unused imports found'
        : `❌ ${violations.length} unused import(s) found`,
  };
}

module.exports = {
  name: 'unused-imports',
  check: checkUnusedImports,
};
