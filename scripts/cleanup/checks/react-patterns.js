#!/usr/bin/env node

/**
 * React Patterns Check Module
 * Validates React hooks usage, component structure, and performance patterns
 * Source: development.mdc (Code Quality Requirements)
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

function findReactFiles() {
  const files = [];
  const searchDirs = ['app', 'components', 'hooks'];

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (
          !entry.name.startsWith('.') &&
          entry.name !== 'node_modules' &&
          entry.name !== '.next'
        ) {
          walkDir(fullPath);
        }
      } else if (/\.(tsx|jsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function analyzeReactPatterns(content, filePath) {
  const violations = [];
  const lines = content.split(/\r?\n/);

  // Skip non-React files
  if (!/\.(tsx|jsx)$/.test(filePath)) return violations;

  // Check for client component directive
  const isClientComponent = content.includes('"use client"') || content.includes("'use client'");
  const hasHooks = /use[A-Z]\w+\(/.test(content) || /useState|useEffect|useCallback|useMemo/.test(content);
  const hasEventHandlers = /onClick|onChange|onSubmit/.test(content);
  const hasBrowserAPI = /window\.|document\.|localStorage|sessionStorage/.test(content);

  // Check for hooks usage
  const hasConditionalHook = /if\s*\([^)]*\)\s*\{[^}]*use[A-Z]\w+\(/.test(content) ||
    /\?.*use[A-Z]\w+\(/.test(content);

  // Check for useEffect cleanup
  const hasUseEffect = /useEffect\(/.test(content);
  const hasCleanup = /return\s+\(\)\s*=>/.test(content) && hasUseEffect;

  // Check for proper dependency arrays
  const hasUseEffectWithoutDeps = /useEffect\([^)]*\)\s*;/.test(content) ||
    /useEffect\([^)]*\)\s*\{/.test(content);
  const hasUseEffectWithDeps = /useEffect\([^)]*,\s*\[/.test(content);

  // Check for React.memo usage
  const hasProps = /props|interface.*Props|type.*Props/.test(content);
  const usesMemo = /React\.memo|memo\(/.test(content);

  // Check for useMemo/useCallback usage
  const hasExpensiveComputation = /\.map\(|\.filter\(|\.reduce\(/.test(content);
  const usesMemoization = /useMemo\(|useCallback\(/.test(content);

  // Check for proper state updates
  const hasDirectStateMutation = /\w+\[.*\]\s*=/.test(content) && /useState/.test(content);
  const hasFunctionalUpdate = /set\w+\(.*prev/.test(content);

  // Violation checks
  if (hasHooks || hasEventHandlers || hasBrowserAPI) {
    if (!isClientComponent) {
      violations.push({
        type: 'missing-client-directive',
        line: findLineNumber(lines, /export|function|const/),
      });
    }
  }

  if (hasConditionalHook) {
    violations.push({
      type: 'conditional-hook',
      line: findLineNumber(lines, /if.*use[A-Z]/),
    });
  }

  if (hasUseEffect && !hasCleanup && /setInterval|setTimeout|addEventListener/.test(content)) {
    violations.push({
      type: 'missing-cleanup',
      line: findLineNumber(lines, /useEffect/),
    });
  }

  if (hasUseEffectWithoutDeps && !hasUseEffectWithDeps) {
    // This is a warning - useEffect should have dependency array
    violations.push({
      type: 'missing-dependency-array',
      line: findLineNumber(lines, /useEffect/),
    });
  }

  if (hasDirectStateMutation && !hasFunctionalUpdate) {
    violations.push({
      type: 'direct-state-mutation',
      line: findLineNumber(lines, /\[.*\]\s*=/),
    });
  }

  // Performance warnings (not critical)
  if (hasProps && !usesMemo && hasExpensiveComputation) {
    violations.push({
      type: 'missing-memoization',
      line: findLineNumber(lines, /\.map\(|\.filter\(|\.reduce\(/),
      severity: 'warning',
    });
  }

  return violations;
}

function findLineNumber(lines, pattern) {
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      return i + 1;
    }
  }
  return undefined;
}

/**
 * Check React patterns
 */
async function checkReactPatterns(files = null) {
  const filesToCheck = files || findReactFiles();
  const violations = [];
  const standardConfig = getStandardConfig('react-patterns');

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const found = analyzeReactPatterns(content, file);

    for (const violation of found) {
      let message;
      let reference = 'See cleanup.mdc (React Patterns) and development.mdc (Code Quality Requirements)';

      switch (violation.type) {
        case 'missing-client-directive':
          message = 'Component uses hooks or browser APIs but missing "use client" directive';
          break;
        case 'conditional-hook':
          message = 'Hooks should not be called conditionally - move hook call to top level';
          break;
        case 'missing-cleanup':
          message = 'useEffect with timers or event listeners should have cleanup function';
          break;
        case 'missing-dependency-array':
          message = 'useEffect should have dependency array (empty [] if no dependencies)';
          break;
        case 'direct-state-mutation':
          message = 'State should be updated using setState, not direct mutation';
          break;
        case 'missing-memoization':
          message = 'Consider using useMemo/useCallback for expensive computations';
          break;
        default:
          message = 'React pattern violation detected';
      }

      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          line: violation.line,
          message,
          severity: violation.severity || standardConfig.severity,
          fixable: standardConfig.fixable,
          standard: standardConfig.source,
          reference,
        }),
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ All React patterns check passed'
        : `⚠️ ${violations.length} React pattern violation(s) found`,
  };
}

module.exports = {
  name: 'react-patterns',
  check: checkReactPatterns,
};
