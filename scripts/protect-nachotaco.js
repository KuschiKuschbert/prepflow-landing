#!/usr/bin/env node

/**
 * Nachotaco Area Protection Script
 *
 * This script helps manage the protected nachotaco area:
 * - Check if any nachotaco files have been modified
 * - Reset nachotaco files to their last committed state
 * - Show status of nachotaco files
 */

const { execSync } = require('child_process');
const path = require('path');

const NACHOTACO_PATH = 'app/nachotaco/';

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
  console.log('🔍 Checking nachotaco area status...\n');

  try {
    // Check for modified files
    const modified = runCommand(`git diff --name-only ${NACHOTACO_PATH}`, { silent: true }).trim();

    // Check for staged files
    const staged = runCommand(`git diff --cached --name-only ${NACHOTACO_PATH}`, {
      silent: true,
    }).trim();

    // Check for untracked files
    const untracked = runCommand(`git ls-files --others --exclude-standard ${NACHOTACO_PATH}`, {
      silent: true,
    }).trim();

    if (!modified && !staged && !untracked) {
      console.log('✅ Nachotaco area is clean - no modifications detected');
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
  console.log('🔄 Resetting nachotaco files to last committed state...\n');

  try {
    // Reset modified files
    runCommand(`git checkout -- ${NACHOTACO_PATH}`);
    console.log('✅ Nachotaco files reset to last committed state');
    return 0;
  } catch (error) {
    console.error('Error resetting files:', error.message);
    return 1;
  }
}

function unstageFiles() {
  console.log('📤 Unstaging nachotaco files...\n');

  try {
    runCommand(`git reset HEAD -- ${NACHOTACO_PATH}`);
    console.log('✅ Nachotaco files unstaged');
    return 0;
  } catch (error) {
    console.error('Error unstaging files:', error.message);
    return 1;
  }
}

function showHelp() {
  console.log(`
Nachotaco Area Protection Script

Usage: node scripts/protect-nachotaco.js [command]

Commands:
  status    Check if any nachotaco files have been modified (default)
  reset     Reset nachotaco files to their last committed state
  unstage   Unstage nachotaco files from the staging area
  help      Show this help message

The nachotaco area (app/nachotaco/) is protected from modifications.
Files in this area are tracked in git but should not be modified.

If you need to modify nachotaco files (emergency only):
  ALLOW_NACHOTACO_MODIFY=1 git commit ...
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
