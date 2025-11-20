#!/usr/bin/env node

/**
 * Unused Imports Fix Module
 * Auto-fixes unused imports using ESLint --fix
 */

const { execSync } = require('child_process');

/**
 * Fix unused imports using ESLint
 */
async function fixUnusedImports(files = null) {
  const changes = [];
  const errors = [];

  try {
    const filesArg = files ? files.join(' ') : '.';
    const command = `npx eslint --fix ${filesArg}`;
    execSync(command, { encoding: 'utf-8', cwd: process.cwd(), stdio: 'inherit' });
    changes.push({ file: 'multiple', changes: 'fixed' });
  } catch (error) {
    errors.push({ file: 'all', error: error.message });
  }

  return {
    fixed: errors.length === 0,
    changes,
    errors,
  };
}

module.exports = {
  name: 'unused-imports',
  fix: fixUnusedImports,
};
