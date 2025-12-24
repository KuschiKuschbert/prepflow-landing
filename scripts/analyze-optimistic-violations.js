#!/usr/bin/env node

/**
 * Analyze optimistic update violations and categorize them for systematic fixing
 */

const fs = require('fs');
const path = require('path');

const VIOLATION_TYPES = {
  'missing-original-state': 'Missing original state storage',
  'missing-optimistic-update': 'Missing optimistic update (state after API call)',
  'missing-rollback': 'Missing rollback logic',
  'loading-state-in-mutation': 'Loading state in mutation',
  'fetch-after-mutation': 'Refetch after mutation',
  'missing-notification': 'Missing notification',
};

function findFiles(dir, extensions = ['.tsx', '.ts']) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      // Skip certain directories
      if (['node_modules', '.next', '.git', 'dist', 'build'].includes(item.name)) {
        continue;
      }
      files.push(...findFiles(fullPath, extensions));
    } else if (extensions.some(ext => item.name.endsWith(ext))) {
      // Skip API routes and lib files (per cleanup script logic)
      if (!fullPath.includes('/api/') && !fullPath.includes('/lib/')) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const violations = [];

  // Check for mutations
  const hasMutation =
    /method:\s*['"](POST|PUT|PATCH|DELETE)['"]/.test(content) ||
    /fetch\([^)]*,\s*\{[^}]*method:\s*['"](POST|PUT|PATCH|DELETE)['"]/.test(content);

  const hasSetState = /set[A-Z]\w+\(/.test(content);
  const hasFetch = /fetch\(/.test(content) || /await.*fetch/.test(content);

  if (!hasMutation || !hasSetState || !hasFetch) {
    return violations; // Not a mutation file
  }

  // Check for optimistic update utilities
  const usesOptimisticUtils =
    /from.*optimistic-updates/.test(content) ||
    /createOptimistic/.test(content) ||
    /useOptimisticMutation/.test(content);

  // Check patterns
  const hasOriginalState =
    /original[A-Z]\w+\s*=/.test(content) ||
    /const\s+original\w+\s*=/.test(content) ||
    (/\[\.\.\.\w+\]/.test(content) && /original/i.test(content));

  const hasOptimisticUpdate = /set\w+\(.*prev/.test(content) || /optimistic/i.test(content);

  const hasRollback = /rollback/i.test(content) || /set\w+\(original/i.test(content);

  const hasNotification =
    /useNotification/.test(content) || /showSuccess/.test(content) || /showError/.test(content);

  const hasLoadingState = /setLoading\(true\)/.test(content);

  const hasFetchAfter =
    /fetchData\(\)/.test(content) || (/fetch\w+\(\)/.test(content) && /response\.ok/.test(content));

  // Categorize violations
  if (usesOptimisticUtils) {
    // Using utilities - only check for anti-patterns
    if (hasLoadingState) {
      violations.push({
        type: 'loading-state-in-mutation',
        severity: 'high',
        fix: 'Remove setLoading(true/false) calls',
      });
    }
    if (hasFetchAfter) {
      violations.push({
        type: 'fetch-after-mutation',
        severity: 'high',
        fix: 'Remove fetchData() calls after mutations',
      });
    }
  } else {
    // Manual implementation - check all patterns
    if (!hasOriginalState) {
      violations.push({
        type: 'missing-original-state',
        severity: 'critical',
        fix: 'Add const originalItems = [...currentItems]; before mutation',
      });
    }

    if (!hasOptimisticUpdate) {
      violations.push({
        type: 'missing-optimistic-update',
        severity: 'critical',
        fix: 'Move setState before await fetch() call',
      });
    }

    if (!hasRollback) {
      violations.push({
        type: 'missing-rollback',
        severity: 'high',
        fix: 'Add rollback: setItems(originalItems) in catch block',
      });
    }

    if (!hasNotification) {
      violations.push({
        type: 'missing-notification',
        severity: 'medium',
        fix: 'Add useNotification hook and showSuccess/showError',
      });
    }

    if (hasLoadingState) {
      violations.push({
        type: 'loading-state-in-mutation',
        severity: 'high',
        fix: 'Remove setLoading(true/false) calls',
      });
    }

    if (hasFetchAfter) {
      violations.push({
        type: 'fetch-after-mutation',
        severity: 'high',
        fix: 'Remove fetchData() calls after mutations',
      });
    }
  }

  return violations.length > 0 ? { file: filePath, violations } : null;
}

function main() {
  const webappDir = path.join(process.cwd(), 'app/webapp');
  const componentsDir = path.join(process.cwd(), 'components');
  const hooksDir = path.join(process.cwd(), 'hooks');

  const allFiles = [...findFiles(webappDir), ...findFiles(componentsDir), ...findFiles(hooksDir)];

  console.log(`Analyzing ${allFiles.length} files...\n`);

  const filesWithViolations = [];
  const violationsByType = {};

  for (const file of allFiles) {
    const result = analyzeFile(file);
    if (result && result.violations && Array.isArray(result.violations)) {
      filesWithViolations.push(result);

      for (const violation of result.violations) {
        if (!violationsByType[violation.type]) {
          violationsByType[violation.type] = [];
        }
        violationsByType[violation.type].push({
          file: result.file,
          severity: violation.severity,
          fix: violation.fix,
        });
      }
    }
  }

  // Print summary
  console.log('📊 Violation Summary:\n');
  console.log(`Total files with violations: ${filesWithViolations.length}\n`);

  console.log('By Type:');
  Object.entries(violationsByType)
    .sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return (severityOrder[a[1][0].severity] || 99) - (severityOrder[b[1][0].severity] || 99);
    })
    .forEach(([type, files]) => {
      const severity = files[0].severity;
      const icon = severity === 'critical' ? '🔴' : severity === 'high' ? '🟠' : '🟡';
      console.log(`  ${icon} ${VIOLATION_TYPES[type] || type}: ${files.length} files`);
    });

  // Print categorized files
  console.log('\n\n📁 Files by Category (Priority Order):\n');

  // Category 1: Loading States (Easy wins)
  const loadingFiles = violationsByType['loading-state-in-mutation'] || [];
  if (loadingFiles.length > 0) {
    console.log('🟢 CATEGORY 1: Loading States in Mutations (Quick Fixes)');
    console.log(`   ${loadingFiles.length} files\n`);
    loadingFiles.slice(0, 10).forEach(({ file }) => {
      console.log(`   - ${file}`);
    });
    if (loadingFiles.length > 10) {
      console.log(`   ... and ${loadingFiles.length - 10} more`);
    }
    console.log('');
  }

  // Category 2: Missing Original State
  const originalStateFiles = violationsByType['missing-original-state'] || [];
  if (originalStateFiles.length > 0) {
    console.log('🟡 CATEGORY 2: Missing Original State Storage');
    console.log(`   ${originalStateFiles.length} files\n`);
    originalStateFiles.slice(0, 10).forEach(({ file }) => {
      console.log(`   - ${file}`);
    });
    if (originalStateFiles.length > 10) {
      console.log(`   ... and ${originalStateFiles.length - 10} more`);
    }
    console.log('');
  }

  // Category 3: Missing Optimistic Update
  const optimisticFiles = violationsByType['missing-optimistic-update'] || [];
  if (optimisticFiles.length > 0) {
    console.log('🟡 CATEGORY 3: Missing Optimistic Update (State After API)');
    console.log(`   ${optimisticFiles.length} files\n`);
    optimisticFiles.slice(0, 10).forEach(({ file }) => {
      console.log(`   - ${file}`);
    });
    if (optimisticFiles.length > 10) {
      console.log(`   ... and ${optimisticFiles.length - 10} more`);
    }
    console.log('');
  }

  // Category 4: Missing Rollback
  const rollbackFiles = violationsByType['missing-rollback'] || [];
  if (rollbackFiles.length > 0) {
    console.log('🟠 CATEGORY 4: Missing Rollback Logic');
    console.log(`   ${rollbackFiles.length} files\n`);
    rollbackFiles.slice(0, 10).forEach(({ file }) => {
      console.log(`   - ${file}`);
    });
    if (rollbackFiles.length > 10) {
      console.log(`   ... and ${rollbackFiles.length - 10} more`);
    }
    console.log('');
  }

  // Category 5: Refetch After Mutation
  const refetchFiles = violationsByType['fetch-after-mutation'] || [];
  if (refetchFiles.length > 0) {
    console.log('🟠 CATEGORY 5: Refetch After Mutation');
    console.log(`   ${refetchFiles.length} files\n`);
    refetchFiles.slice(0, 10).forEach(({ file }) => {
      console.log(`   - ${file}`);
    });
    if (refetchFiles.length > 10) {
      console.log(`   ... and ${refetchFiles.length - 10} more`);
    }
    console.log('');
  }

  // Category 6: Missing Notifications
  const notificationFiles = violationsByType['missing-notification'] || [];
  if (notificationFiles.length > 0) {
    console.log('🔵 CATEGORY 6: Missing Notifications');
    console.log(`   ${notificationFiles.length} files\n`);
    notificationFiles.slice(0, 10).forEach(({ file }) => {
      console.log(`   - ${file}`);
    });
    if (notificationFiles.length > 10) {
      console.log(`   ... and ${notificationFiles.length - 10} more`);
    }
    console.log('');
  }

  // Save detailed report
  const reportPath = path.join(process.cwd(), 'OPTIMISTIC_VIOLATIONS_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify({ filesWithViolations, violationsByType }, null, 2));
  console.log(`\n✅ Detailed report saved to: ${reportPath}`);
  console.log('\n💡 Next Steps:');
  console.log('   1. Start with Category 1 (Loading States) - quickest wins');
  console.log('   2. Then Category 2 & 3 (Original State & Optimistic Update)');
  console.log('   3. Then Category 4 & 5 (Rollback & Refetch)');
  console.log('   4. Finally Category 6 (Notifications) - polish');
}

main();
