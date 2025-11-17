#!/usr/bin/env node

/**
 * Prettier Fix Module
 * Auto-fixes formatting using Prettier
 */

const { execSync } = require('child_process');

/**
 * Fix Prettier formatting
 */
async function fixPrettier(files = null) {
  const changes = [];
  const errors = [];

  try {
    const filesArg = files ? files.join(' ') : '.';
    const command = `npx prettier --write ${filesArg}`;
    execSync(command, { encoding: 'utf-8', cwd: process.cwd(), stdio: 'inherit' });
    changes.push({ file: 'multiple', changes: 'formatted' });
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
  name: 'prettier',
  fix: fixPrettier,
};
