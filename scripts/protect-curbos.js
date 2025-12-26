#!/usr/bin/env node

/**
 * Curbos Area Protection Script
 *
 * This script helps manage the protected curbos area:
 * - Check if any curbos files have been modified
 * - Reset curbos files to their last committed state
 * - Show status of curbos files
 */

const { execSync } = require('child_process');
const path = require('path');

const CURBOS_PATH = 'app/curbos/';

function runCommand(command, options = {}) {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
  } catch (error) {
    if (!options.silent) {
      console.error(`Error running command: ${command}`);
      console.error(error.message);
    }
    throw error;
  }
}

function checkStatus() {
  console.log('🔍 Checking curbos area status...\n');

  try {
    // Check for modified files
    const modified = runCommand(`git diff --name-only ${CURBOS_PATH}`, { silent: true }).trim();

    // Check for staged files
    const staged = runCommand(`git diff --cached --name-only ${CURBOS_PATH}`, {
      silent: true,
    }).trim();

    // Check for untracked files
    const untracked = runCommand(`git ls-files --others --exclude-standard ${CURBOS_PATH}`, {
      silent: true,
    }).trim();

    if (!modified && !staged && !untracked) {
      console.log('✅ Curbos area is clean - no modifications detected');
      return 0;
    }

    if (modified) {
      console.log('⚠️  Modified files (not staged):');
      modified.split('\n').forEach(file => {
        console.log(`   - ${file}`);
      });
      console.log('');
    }

    if (staged) {
      console.log('❌ Staged files (will be blocked by pre-commit hook):');
      staged.split('\n').forEach(file => {
        console.log(`   - ${file}`);
      });
      console.log('');
    }

    if (untracked) {
      console.log('⚠️  Untracked files:');
      untracked.split('\n').forEach(file => {
        console.log(`   - ${file}`);
      });
      console.log('');
    }

    return 1;
  } catch (error) {
    console.error('Error checking status:', error.message);
    return 1;
  }
}

function resetFiles() {
  console.log('🔄 Resetting curbos files to last committed state...\n');

  try {
    // Reset modified files
    runCommand(`git checkout -- ${CURBOS_PATH}`);
    console.log('✅ Curbos files reset to last committed state');
    return 0;
  } catch (error) {
    console.error('Error resetting files:', error.message);
    return 1;
  }
}

function unstageFiles() {
  console.log('📤 Unstaging curbos files...\n');

  try {
    runCommand(`git reset HEAD -- ${CURBOS_PATH}`);
    console.log('✅ Curbos files unstaged');
    return 0;
  } catch (error) {
    console.error('Error unstaging files:', error.message);
    return 1;
  }
}

function showHelp() {
  console.log(`
Curbos Area Protection Script

Usage: node scripts/protect-curbos.js [command]

Commands:
  status    Check if any curbos files have been modified (default)
  reset     Reset curbos files to their last committed state
  unstage   Unstage curbos files from the staging area
  help      Show this help message

The curbos area (app/curbos/) is protected from modifications.
Files in this area are tracked in git but should not be modified.

If you need to modify curbos files (emergency only):
  ALLOW_CURBOS_MODIFY=1 git commit ...
`);
}

// Main execution
const command = process.argv[2] || 'status';

switch (command) {
  case 'status':
    process.exit(checkStatus());
  case 'reset':
    process.exit(resetFiles());
  case 'unstage':
    process.exit(unstageFiles());
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    process.exit(0);
  default:
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
