#!/usr/bin/env node

/**
 * Optimistic Updates Check Module
 * Enforces optimistic updates pattern for all CRUD operations
 * Source: development.mdc (Optimistic Updates Pattern), operations.mdc (Optimistic Updates Standard)
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

function findComponentFiles() {
  const files = [];
  const searchDirs = ['app/webapp', 'components', 'hooks'];

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

function findHookFiles() {
  const files = [];
  const searchDirs = ['hooks', 'app/webapp'];

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
      } else if (/\.(ts|tsx)$/.test(entry.name) && /hooks?/.test(fullPath)) {
        files.push(fullPath);
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function analyzeOptimisticUpdates(content, filePath) {
  const violations = [];
  const lines = content.split(/\r?\n/);

  // Skip API routes and utility files
  if (filePath.includes('/api/') || filePath.includes('/lib/')) return violations;

  // Detect CRUD operations
  const hasMutation = /method:\s*['"](POST|PUT|PATCH|DELETE)['"]/.test(content) ||
    /fetch\([^)]*,\s*\{[^}]*method:\s*['"](POST|PUT|PATCH|DELETE)['"]/.test(content) ||
    /method:\s*['"](POST|PUT|PATCH|DELETE)['"]/.test(content);

  // Check for state updates after API calls
  const hasSetState = /set[A-Z]\w+\(/.test(content) || /useState/.test(content);
  const hasFetch = /fetch\(/.test(content) || /\.then\(/.test(content) || /await.*fetch/.test(content);

  // Check for mutations that update state
  const hasMutationWithState = hasMutation && hasSetState && hasFetch;

  if (!hasMutationWithState) return violations; // No mutations detected

  // Check for optimistic update patterns
  const hasOriginalState = /original[A-Z]\w+\s*=/.test(content) ||
    /const\s+original\w+\s*=/.test(content) ||
    /\[...\w+\]/.test(content) && /original/i.test(content);

  // Check for immediate UI updates (setState before await)
  // This is harder to detect statically, so we check for common patterns
  const hasOptimisticUpdate = /set\w+\(.*prev/.test(content) ||
    /optimistic/i.test(content) ||
    /useOptimisticMutation/.test(content) ||
    /createOptimistic/.test(content);

  // Check for rollback logic
  const hasRollback = /rollback/i.test(content) ||
    /set\w+\(original/i.test(content) ||
    /catch\s*\([^)]*\)\s*\{[^}]*set\w+\(/.test(content);

  // Check for useNotification usage
  const hasNotification = /useNotification/.test(content) ||
    /showSuccess/.test(content) ||
    /showError/.test(content) ||
    /showWarning/.test(content) ||
    /showInfo/.test(content);

  // Check for loading states (anti-pattern)
  const hasLoadingState = /isLoading/.test(content) ||
    /loading/.test(content) && /useState/.test(content) ||
    /setLoading\(true\)/.test(content);

  // Check for fetchData calls after mutations (anti-pattern)
  const hasFetchDataAfterMutation = /fetchData\(\)/.test(content) ||
    /fetch\w+\(\)/.test(content) && /\.then\(/.test(content) && /response\.ok/.test(content);

  // Check for useOptimisticMutation hook usage
  const usesOptimisticHook = /useOptimisticMutation/.test(content);

  // Check for optimistic update utilities
  const usesOptimisticUtils = /from.*optimistic-updates/.test(content) ||
    /createOptimistic/.test(content);

  // Violation checks
  if (hasMutationWithState) {
    // If using the hook or utilities, that's good
    if (usesOptimisticHook || usesOptimisticUtils) {
      // Still check for anti-patterns
      if (hasLoadingState) {
        violations.push({
          type: 'loading-state-in-mutation',
          line: findLineNumber(lines, /isLoading|loading|setLoading/),
        });
      }

      if (hasFetchDataAfterMutation) {
        violations.push({
          type: 'fetch-after-mutation',
          line: findLineNumber(lines, /fetchData|fetch\w+\(\)/),
        });
      }
    } else {
      // Not using hook/utilities - check for manual pattern
      if (!hasOriginalState) {
        violations.push({
          type: 'missing-original-state',
          line: findLineNumber(lines, /set\w+\(/) || findLineNumber(lines, /fetch/),
        });
      }

      if (!hasOptimisticUpdate) {
        violations.push({
          type: 'missing-optimistic-update',
          line: findLineNumber(lines, /fetch/),
        });
      }

      if (!hasRollback) {
        violations.push({
          type: 'missing-rollback',
          line: findLineNumber(lines, /catch/),
        });
      }

      if (!hasNotification) {
        violations.push({
          type: 'missing-notification',
          line: findLineNumber(lines, /fetch/),
        });
      }

      if (hasLoadingState) {
        violations.push({
          type: 'loading-state-in-mutation',
          line: findLineNumber(lines, /isLoading|loading|setLoading/),
        });
      }

      if (hasFetchDataAfterMutation) {
        violations.push({
          type: 'fetch-after-mutation',
          line: findLineNumber(lines, /fetchData|fetch\w+\(\)/),
        });
      }
    }
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
 * Check optimistic updates pattern
 */
async function checkOptimisticUpdates(files = null) {
  const componentFiles = findComponentFiles();
  const hookFiles = findHookFiles();
  const filesToCheck = files || [...componentFiles, ...hookFiles];
  const violations = [];
  const standardConfig = getStandardConfig('optimistic-updates');

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const found = analyzeOptimisticUpdates(content, file);

    for (const violation of found) {
      let message;
      let reference = 'See cleanup.mdc (Optimistic Updates) and development.mdc (Optimistic Updates Pattern)';

      switch (violation.type) {
        case 'missing-original-state':
          message = 'CRUD operations should store original state before optimistic updates';
          break;
        case 'missing-optimistic-update':
          message = 'CRUD operations should update UI immediately (optimistic update) before API call';
          break;
        case 'missing-rollback':
          message = 'CRUD operations should have rollback logic in catch blocks';
          break;
        case 'missing-notification':
          message = 'CRUD operations should use useNotification for user feedback';
          break;
        case 'loading-state-in-mutation':
          message = 'Mutations should not show loading states - use optimistic updates instead';
          break;
        case 'fetch-after-mutation':
          message = 'Mutations should not call fetchData() after success - rely on optimistic updates';
          break;
        default:
          message = 'Optimistic update pattern violation detected';
      }

      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          line: violation.line,
          message,
          severity: standardConfig.severity,
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
        ? '✅ All optimistic update patterns check passed'
        : `❌ ${violations.length} optimistic update pattern violation(s) found`,
  };
}

module.exports = {
  name: 'optimistic-updates',
  check: checkOptimisticUpdates,
};
