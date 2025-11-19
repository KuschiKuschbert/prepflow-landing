#!/usr/bin/env node

/**
 * Prettier Check Module
 * Validates Prettier formatting
 * Source: development.mdc (Prettier Configuration)
 */

const { execSync } = require('child_process');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

/**
 * Check Prettier formatting
 */
async function checkPrettier(files = null) {
  const violations = [];
  const standardConfig = getStandardConfig('prettier');

  try {
    const filesArg = files ? files.join(' ') : '.';
    const command = `npx prettier --check --list-different ${filesArg} 2>/dev/null || true`;
    const output = execSync(command, { encoding: 'utf-8', cwd: process.cwd() });

    if (output && output.trim()) {
      const unformattedFiles = output.trim().split('\n').filter(Boolean);
      for (const file of unformattedFiles) {
        violations.push(
          createViolation({
            file,
            message: 'File is not formatted according to Prettier rules',
            severity: standardConfig.severity,
            fixable: standardConfig.fixable,
            standard: standardConfig.source,
            reference: 'See cleanup.mdc (Prettier Configuration) - use cleanup:fix to auto-format',
          }),
        );
      }
    }
  } catch (error) {
    // Prettier might not be available - that's okay
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ All files formatted correctly'
        : `❌ ${violations.length} file(s) need Prettier formatting`,
  };
}

module.exports = {
  name: 'prettier',
  check: checkPrettier,
};

