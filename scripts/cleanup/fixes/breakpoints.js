#!/usr/bin/env node

/**
 * Breakpoint Fix Module
 * Auto-fixes rogue breakpoints using existing codemod
 * Source: scripts/codemods/breakpoint-migration.js
 */

const { execSync } = require('child_process');
const path = require('path');

/**
 * Fix breakpoints using codemod
 */
async function fixBreakpoints(files = null) {
  const changes = [];
  const errors = [];

  try {
    const filesArg = files ? files.join(' ') : 'app components';
    const command = `npx jscodeshift -t scripts/codemods/breakpoint-migration.js --write ${filesArg}`;
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
  name: 'breakpoints',
  fix: fixBreakpoints,
};

