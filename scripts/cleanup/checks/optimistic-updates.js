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

  // Skip form components (Wizard, Form, Dialog) - they update form state, not data lists
  if (
    /Wizard|Form|Dialog|Modal/i.test(filePath) &&
    !/useState.*\[\]/.test(content) // Only skip if not managing array state
  ) {
    return violations;
  }

  // Skip setup/populate/reset operations - one-time operations, not CRUD
  if (/setup|Populate|Reset|Seed/i.test(filePath)) return violations;

  // Skip batch read operations (POST for fetching, not mutations)
  if (/batch|fetch.*cost|fetch.*price/i.test(content) && /method.*POST/.test(content)) {
    return violations;
  }

  // Skip restore/backup operations - they don't update managed state lists
  if (/restore|backup/i.test(filePath)) return violations;

  // Skip operations that navigate away after mutation (don't update local state)
  if (
    /router\.push|router\.replace|window\.location/.test(content) &&
    /method.*POST|method.*PUT/.test(content)
  ) {
    // Check if mutation updates state before navigation
    const mutationBeforeNav =
      /method.*POST|method.*PUT/.test(content) &&
      /set[A-Z]\w+\(.*prev/.test(content) &&
      content.indexOf('method') < content.indexOf('router.push');
    if (!mutationBeforeNav) return violations;
  }

  // Skip print/export operations - they don't mutate state, just open dialogs/download files
  if (
    /print\w+|export\w+|download/i.test(content) &&
    !/method.*POST|method.*PUT|method.*DELETE/.test(content)
  ) {
    return violations;
  }

  // Detect CRUD operations
  const hasMutation =
    /method:\s*['"](POST|PUT|PATCH|DELETE)['"]/.test(content) ||
    /fetch\([^)]*,\s*\{[^}]*method:\s*['"](POST|PUT|PATCH|DELETE)['"]/.test(content) ||
    /method:\s*['"](POST|PUT|PATCH|DELETE)['"]/.test(content);

  // Check for state updates after API calls
  const hasSetState = /set[A-Z]\w+\(/.test(content) || /useState/.test(content);
  const hasFetch =
    /fetch\(/.test(content) || /\.then\(/.test(content) || /await.*fetch/.test(content);

  // Check for mutations that update state
  const hasMutationWithState = hasMutation && hasSetState && hasFetch;

  if (!hasMutationWithState) return violations; // No mutations detected

  // Check if component manages data lists (array state) - used for multiple checks
  const managesDataList = /useState.*\[\]/.test(content); // Manages array state

  // Skip utility functions that don't manage state (they return values, don't update state)
  const isUtilityFunction =
    (/helpers\/|utils\/|helpers\.ts|utils\.ts/.test(filePath) ||
      /handleFetch|handle\w+Fetch/.test(filePath)) && // Fetch handlers
    !managesDataList && // Not managing array state
    /return\s+\{|return\s+null|return\s+undefined|return\s+response|return\s+Promise/.test(content); // Returns values

  if (isUtilityFunction) return violations;

  // Skip hooks that only return data (don't update managed state lists)
  const isDataReturnHook =
    /use\w+CRUD|use\w+Fetch|use\w+Check/.test(filePath) &&
    !managesDataList && // Not managing array state
    /return\s+\{|return\s*\{/.test(content) && // Returns object
    !/set[A-Z]\w+\(.*prev.*=>.*\[/.test(content); // Doesn't update array state

  if (isDataReturnHook) return violations;

  // Skip setup/check operations that don't mutate managed data lists
  const isSetupOperation =
    (/setup|check|Check|Setup/.test(filePath) || /checkDatabase|setupDatabase/.test(content)) &&
    !managesDataList && // Not managing array state
    !/set[A-Z]\w+\(.*prev.*=>.*\[/.test(content); // Doesn't update array state

  if (isSetupOperation) return violations;

  // Skip components that don't manage data lists (only manage form/UI state)
  const onlyFormState =
    /useState.*\{|formData|form.*state/i.test(content) && // Only form state
    !managesDataList; // Doesn't manage data list

  if (onlyFormState && !/set[A-Z]\w+\(.*prev.*=>.*\[/.test(content)) {
    return violations; // Only form state, not data list
  }

  // Skip hooks that only manage UI state (loading, cancelling, etc.) not data lists
  const onlyUIState =
    /useState.*(loading|cancelling|isLoading|isSaving|isDeleting|isSubmitting)/i.test(content) &&
    !managesDataList; // Only UI state, not data list

  if (onlyUIState && !/set[A-Z]\w+\(.*prev.*=>.*\[/.test(content)) {
    return violations; // Only UI state, not data list
  }

  // Skip operations that don't update managed state (sharing, notifications, etc.)
  const isShareOperation = /share|Share/.test(content) && !managesDataList;
  const isNotificationOperation = /notification|Notification/.test(content) && !managesDataList;
  const onlyCallsCallback =
    /onSuccess\(\)|onComplete\(\)|refreshSubscription\(\)/.test(content) && !managesDataList;

  if (
    (isShareOperation || isNotificationOperation || onlyCallsCallback) &&
    !/set[A-Z]\w+\(.*prev.*=>.*\[/.test(content)
  ) {
    return violations; // Doesn't update managed state lists
  }

  // Skip AI generation hooks - they're not CRUD operations, just API calls for AI responses
  if (
    /useAI|useAI\w+/.test(filePath) ||
    (/generate|AI|ai/.test(content) && /\/api\/ai\//.test(content))
  ) {
    return violations; // AI generation, not CRUD
  }

  // Skip sync/trigger utilities - they trigger background syncs, don't manage UI state
  if (
    /createDebounceSync|sync.*trigger|triggerSync/i.test(filePath) ||
    (/debounce.*sync|trigger.*sync/i.test(content) && !managesDataList)
  ) {
    return violations; // Background sync utilities, not UI state mutations
  }

  // Skip data fetching loading states (not mutation loading states)
  // If loading state is only used with fetchData() or in useEffect for initial load, it's data fetching
  const isDataFetchingLoading =
    /loading.*data|dataLoading|fetchData/.test(content) &&
    /useEffect.*fetchData|fetchData.*useEffect/.test(content) &&
    !/method.*POST|method.*PUT|method.*DELETE/.test(content);

  if (isDataFetchingLoading) {
    return violations; // Data fetching, not mutations
  }

  // Check for optimistic update patterns
  const hasOriginalState =
    /original[A-Z]\w+\s*=/.test(content) ||
    /const\s+original\w+\s*=/.test(content) ||
    (/\[...\w+\]/.test(content) && /original/i.test(content)) ||
    // Functions that receive original state as parameter
    /original\w+:\s*\w+/.test(content) ||
    // Functions that create temp items (for create operations)
    /temp\w+\s*=|createTemp\w+/.test(content);

  // Check for immediate UI updates (setState before await)
  // This is harder to detect statically, so we check for common patterns
  const hasOptimisticUpdate =
    /set\w+\(.*prev/.test(content) ||
    /optimistic/i.test(content) ||
    /useOptimisticMutation/.test(content) ||
    /createOptimistic/.test(content) ||
    // Functions that update/add immediately before API call
    /(add\w+|update\w+|set\w+)\([^)]*\)\s*;?\s*try/.test(content) ||
    // Functions that create temp and add immediately
    /temp\w+\s*=.*;\s*(add\w+|update\w+)\(temp/.test(content);

  // Check for rollback logic
  const hasRollback =
    /rollback/i.test(content) ||
    /set\w+\(original/i.test(content) ||
    /catch\s*\([^)]*\)\s*\{[^}]*set\w+\(/.test(content) ||
    // Functions that remove temp items on error
    /remove\w+\(temp/i.test(content) ||
    // Functions that revert using original parameter
    /update\w+\([^,]+,\s*original/i.test(content);

  // Check for useNotification usage
  const hasNotification =
    /useNotification/.test(content) ||
    /showSuccess/.test(content) ||
    /showError/.test(content) ||
    /showWarning/.test(content) ||
    /showInfo/.test(content);

  // Check for loading states (anti-pattern)
  const hasLoadingState =
    /isLoading/.test(content) ||
    (/loading/.test(content) && /useState/.test(content)) ||
    /setLoading\(true\)/.test(content);

  // Check for fetchData calls after mutations (anti-pattern)
  // Exclude fetchData() calls in useEffect (initial data loading, not after mutations)
  // Also exclude fetchData in dependency arrays or conditional calls in useEffect
  const fetchDataInUseEffect = /useEffect[^}]*fetchData|fetchData[^}]*useEffect/.test(content);
  const hasFetchDataAfterMutation =
    (/fetchData\(\)/.test(content) && !fetchDataInUseEffect) ||
    (/fetch\w+\(\)/.test(content) &&
      /\.then\(/.test(content) &&
      /response\.ok/.test(content) &&
      !/useEffect/.test(content));

  // Check for useOptimisticMutation hook usage
  const usesOptimisticHook = /useOptimisticMutation/.test(content);

  // Check for optimistic update utilities
  const usesOptimisticUtils =
    /from.*optimistic-updates/.test(content) || /createOptimistic/.test(content);

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
      const hasOptimisticPattern = hasOriginalState && hasOptimisticUpdate && hasRollback;

      // Exclude hooks that don't manage state (they just make API calls and return results)
      const isDataReturnHook =
        /use\w+CRUD|use\w+Save|use\w+Fetch/.test(filePath) &&
        !managesDataList &&
        /return\s+\{|return\s*\{/.test(content) &&
        !/set[A-Z]\w+\(.*prev.*=>.*\[/.test(content);

      if (!isDataReturnHook) {
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
      }

      // Exclude utility functions and hooks that don't manage state from useNotification requirement
      // Utility functions can't use hooks, and hooks that just return data don't need notifications
      const isUtilityFunctionForNotification =
        /helpers\/|utils\/|helpers\.ts|utils\.ts/.test(filePath) ||
        /handleFetch|handle\w+Fetch|load\w+Details|prepDetailsLoading|DetailsLoading/.test(
          filePath,
        );
      const isDataReturnHookForNotification =
        /use\w+CRUD|use\w+Save|use\w+Fetch/.test(filePath) &&
        !managesDataList &&
        /return\s+\{|return\s*\{/.test(content);

      if (
        !hasNotification &&
        !isUtilityFunctionForNotification &&
        !isDataReturnHookForNotification
      ) {
        violations.push({
          type: 'missing-notification',
          line: findLineNumber(lines, /fetch/),
        });
      }

      // Only flag loading states if optimistic updates are NOT implemented
      // (loading states for data fetching are acceptable)
      if (hasLoadingState && !hasOptimisticPattern) {
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
      let reference =
        'See cleanup.mdc (Optimistic Updates) and development.mdc (Optimistic Updates Pattern)';

      switch (violation.type) {
        case 'missing-original-state':
          message = 'CRUD operations should store original state before optimistic updates';
          break;
        case 'missing-optimistic-update':
          message =
            'CRUD operations should update UI immediately (optimistic update) before API call';
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
          message =
            'Mutations should not call fetchData() after success - rely on optimistic updates';
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
