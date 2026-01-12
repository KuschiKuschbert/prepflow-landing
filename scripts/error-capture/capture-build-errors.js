#!/usr/bin/env node

/**
 * Build Error Capture Integration
 * Hooks into build process to capture TypeScript, ESLint, and Next.js errors
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { captureBuildError } = require('./capture-error');

const BUILD_ERROR_OUTPUT = path.join(__dirname, '../../.error-capture/build-errors.txt');

/**
 * Capture TypeScript errors
 */
function captureTypeScriptErrors() {
  try {
    console.log('[Build Error Capture] Running TypeScript type check...');
    const output = execSync('npm run type-check 2>&1', { encoding: 'utf8', stdio: 'pipe' });
    // If successful, no errors to capture
    return [];
  } catch (err) {
    // TypeScript errors are in stderr
    const errorOutput = err.stderr || err.stdout || err.message;
    return captureBuildError(errorOutput, 'TypeScript');
  }
}

/**
 * Capture ESLint errors
 */
function captureESLintErrors() {
  try {
    console.log('[Build Error Capture] Running ESLint...');
    const output = execSync('npm run lint 2>&1', { encoding: 'utf8', stdio: 'pipe' });
    // If successful, no errors to capture
    return [];
  } catch (err) {
    // ESLint errors are in stdout
    const errorOutput = err.stdout || err.stderr || err.message;
    return captureBuildError(errorOutput, 'ESLint');
  }
}

/**
 * Capture Next.js build errors
 */
function captureNextJSErrors() {
  try {
    console.log('[Build Error Capture] Running Next.js build...');
    const output = execSync('npm run build 2>&1', { encoding: 'utf8', stdio: 'pipe' });
    // If successful, no errors to capture
    return [];
  } catch (err) {
    // Next.js build errors are in stderr
    const errorOutput = err.stderr || err.stdout || err.message;
    return captureBuildError(errorOutput, 'Next.js');
  }
}

/**
 * Capture all build errors
 */
function captureAllBuildErrors() {
  const errors = {
    typescript: [],
    eslint: [],
    nextjs: [],
  };
  
  // Capture TypeScript errors
  try {
    errors.typescript = captureTypeScriptErrors();
  } catch (err) {
    console.error('[Build Error Capture] Failed to capture TypeScript errors:', err);
  }
  
  // Capture ESLint errors
  try {
    errors.eslint = captureESLintErrors();
  } catch (err) {
    console.error('[Build Error Capture] Failed to capture ESLint errors:', err);
  }
  
  // Capture Next.js build errors (only if TypeScript/ESLint passed)
  if (errors.typescript.length === 0 && errors.eslint.length === 0) {
    try {
      errors.nextjs = captureNextJSErrors();
    } catch (err) {
      console.error('[Build Error Capture] Failed to capture Next.js errors:', err);
    }
  }
  
  // Save error output for later analysis
  const totalErrors = errors.typescript.length + errors.eslint.length + errors.nextjs.length;
  if (totalErrors > 0) {
    const errorOutput = [
      `TypeScript Errors: ${errors.typescript.length}`,
      `ESLint Errors: ${errors.eslint.length}`,
      `Next.js Errors: ${errors.nextjs.length}`,
      '',
      'Captured Error IDs:',
      ...errors.typescript.map(id => `  TypeScript: ${id}`),
      ...errors.eslint.map(id => `  ESLint: ${id}`),
      ...errors.nextjs.map(id => `  Next.js: ${id}`),
    ].join('\n');
    
    fs.writeFileSync(BUILD_ERROR_OUTPUT, errorOutput);
    console.log(`\n✅ Captured ${totalErrors} build error(s)`);
    console.log(`   Error details saved to: ${BUILD_ERROR_OUTPUT}`);
  } else {
    console.log('\n✅ No build errors found');
  }
  
  return errors;
}

/**
 * Main CLI interface
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';
  
  switch (command) {
    case 'typescript':
    case 'ts':
      captureTypeScriptErrors();
      break;
      
    case 'eslint':
      captureESLintErrors();
      break;
      
    case 'nextjs':
    case 'next':
      captureNextJSErrors();
      break;
      
    case 'all':
      captureAllBuildErrors();
      break;
      
    default:
      console.log(`
Build Error Capture Script

Usage:
  capture-build-errors.js [command]

Commands:
  all         Capture all build errors (default)
  typescript  Capture TypeScript errors only
  eslint      Capture ESLint errors only
  nextjs      Capture Next.js build errors only
      `);
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  captureTypeScriptErrors,
  captureESLintErrors,
  captureNextJSErrors,
  captureAllBuildErrors,
};
