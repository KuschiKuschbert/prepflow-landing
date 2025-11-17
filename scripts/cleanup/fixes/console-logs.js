#!/usr/bin/env node

/**
 * Console.log Fix Module
 * Auto-fixes console.log usage using existing codemod
 * Source: scripts/codemods/console-migration.js
 */

const { execSync } = require('child_process');

/**
 * Fix console.log using codemod
 */
async function fixConsoleLogs(files = null) {
  const changes = [];
  const errors = [];

  try {
    const filesArg = files ? files.join(' ') : 'app components';
    const command = `npx jscodeshift -t scripts/codemods/console-migration.js --write ${filesArg}`;
    execSync(command, { encoding: 'utf-8', cwd: process.cwd(), stdio: 'inherit' });
    changes.push({ file: 'multiple', changes: 'migrated' });
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
  name: 'console-logs',
  fix: fixConsoleLogs,
};

