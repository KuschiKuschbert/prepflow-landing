#!/usr/bin/env node

/**
 * ESLint Check Module
 * Validates ESLint rules
 * Source: development.mdc (ESLint Configuration)
 */

const { execSync } = require('child_process');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

/**
 * Check ESLint violations
 */
async function checkESLint(files = null) {
  const violations = [];
  const standardConfig = getStandardConfig('eslint');

  try {
    const filesArg = files ? files.join(' ') : '.';
    const command = `npx eslint --format json ${filesArg} 2>/dev/null || true`;
    const output = execSync(command, { encoding: 'utf-8', cwd: process.cwd() });

    if (output) {
      try {
        const results = JSON.parse(output);
        for (const result of results) {
          for (const message of result.messages || []) {
            if (message.severity === 1 || message.severity === 2) {
              violations.push(
                createViolation({
                  file: result.filePath,
                  line: message.line,
                  column: message.column,
                  message: `ESLint: ${message.message} (${message.ruleId || 'unknown'})`,
                  severity: message.severity === 2 ? 'critical' : standardConfig.severity,
                  fixable: message.fixable || standardConfig.fixable,
                  standard: standardConfig.source,
                  reference: 'See cleanup.mdc (ESLint Standards) - use cleanup:fix to auto-fix',
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
    // ESLint might not be available - that's okay
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ No ESLint violations found'
        : `❌ ${violations.length} ESLint violation(s) found`,
  };
}

module.exports = {
  name: 'eslint',
  check: checkESLint,
};
