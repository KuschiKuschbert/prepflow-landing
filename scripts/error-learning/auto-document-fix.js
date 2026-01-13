#!/usr/bin/env node

/**
 * Automatic Fix Documentation
 * Automatically documents fixes after successful builds
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { detectFixes } = require('./detect-fixes');

const BUILD_ERROR_OUTPUT = path.join(__dirname, '../../.error-capture/build-errors.txt');
const LAST_BUILD_STATE = path.join(__dirname, '../../.error-capture/last-build-state.json');

/**
 * Get current build state
 */
function getBuildState() {
  try {
    const currentCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const hasErrors = fs.existsSync(BUILD_ERROR_OUTPUT);
    const errors = hasErrors ? fs.readFileSync(BUILD_ERROR_OUTPUT, 'utf8') : '';

    return {
      commit: currentCommit,
      hasErrors,
      errors: errors.substring(0, 1000), // Limit size
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return {
      commit: 'unknown',
      hasErrors: false,
      errors: '',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Load last build state
 */
function loadLastBuildState() {
  if (!fs.existsSync(LAST_BUILD_STATE)) {
    return null;
  }

  try {
    const content = fs.readFileSync(LAST_BUILD_STATE, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Save build state
 */
function saveBuildState(state) {
  const stateDir = path.dirname(LAST_BUILD_STATE);
  if (!fs.existsSync(stateDir)) {
    fs.mkdirSync(stateDir, { recursive: true });
  }

  fs.writeFileSync(LAST_BUILD_STATE, JSON.stringify(state, null, 2));
}

/**
 * Auto-document fixes after successful build
 */
async function autoDocumentFixes() {
  const currentState = getBuildState();
  const lastState = loadLastBuildState();

  // If last build had errors and current build is successful, errors were fixed
  if (lastState && lastState.hasErrors && !currentState.hasErrors) {
    console.log('[Auto Document Fix] Errors were resolved, detecting fixes...');

    try {
      // Detect fixes from git history
      const fixes = await detectFixes();

      if (fixes && fixes.length > 0) {
        console.log(`✅ Auto-detected ${fixes.length} fix(es)`);
        console.log('   Fixes documented in knowledge base');
      } else {
        console.log('✅ No fixes auto-detected (errors may have been resolved manually)');
      }
    } catch (err) {
      console.error('[Auto Document Fix] Failed to detect fixes:', err);
    }
  } else if (!lastState) {
    console.log('[Auto Document Fix] First build state recorded');
  } else if (currentState.hasErrors) {
    console.log('[Auto Document Fix] Build still has errors, skipping auto-documentation');
  } else {
    console.log('[Auto Document Fix] No errors in previous build, skipping auto-documentation');
  }

  // Save current state
  saveBuildState(currentState);
}

/**
 * Main CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'check';

  switch (command) {
    case 'check':
      await autoDocumentFixes();
      break;

    case 'state':
      const state = getBuildState();
      console.log('Current build state:');
      console.log(JSON.stringify(state, null, 2));
      break;

    default:
      console.log(`
Automatic Fix Documentation Script

Usage:
  auto-document-fix.js [command]

Commands:
  check  Check and auto-document fixes (default)
  state  Show current build state
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = {
  autoDocumentFixes,
  getBuildState,
  loadLastBuildState,
};
