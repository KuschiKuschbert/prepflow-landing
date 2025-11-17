#!/usr/bin/env node

/**
 * Unified Cleanup Script
 * Single entry point for all cleanup checks and fixes
 * Enforces ALL standards from cleanup.mdc and all MDC files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import all check modules
const fileSizesCheck = require('./cleanup/checks/file-sizes');
const breakpointsCheck = require('./cleanup/checks/breakpoints');
const consoleLogsCheck = require('./cleanup/checks/console-logs');
const unusedImportsCheck = require('./cleanup/checks/unused-imports');
const typescriptRefTypesCheck = require('./cleanup/checks/typescript-ref-types');
const jsdocCheck = require('./cleanup/checks/jsdoc');
const iconsCheck = require('./cleanup/checks/icons');
const namingCheck = require('./cleanup/checks/naming');
const prettierCheck = require('./cleanup/checks/prettier');
const eslintCheck = require('./cleanup/checks/eslint');
const deadCodeCheck = require('./cleanup/checks/dead-code');
const securityCheck = require('./cleanup/checks/security');
const performanceCheck = require('./cleanup/checks/performance');

// Import all fix modules
const breakpointsFix = require('./cleanup/fixes/breakpoints');
const consoleLogsFix = require('./cleanup/fixes/console-logs');
const unusedImportsFix = require('./cleanup/fixes/unused-imports');
const prettierFix = require('./cleanup/fixes/prettier');
const deadCodeFix = require('./cleanup/fixes/dead-code');

// Import utilities
const {
  generateJSONReport,
  generateCLIReport,
  generateHTMLReport,
} = require('./cleanup/utils/reporter');
const { filterViolationsBySeverity } = require('./cleanup/utils/violations');

// All check modules
const CHECK_MODULES = [
  fileSizesCheck,
  breakpointsCheck,
  consoleLogsCheck,
  unusedImportsCheck,
  typescriptRefTypesCheck,
  jsdocCheck,
  iconsCheck,
  namingCheck,
  prettierCheck,
  eslintCheck,
  deadCodeCheck,
  securityCheck,
  performanceCheck,
];

// All fix modules (mapped by check name)
const FIX_MODULES = {
  breakpoints: breakpointsFix,
  'console-logs': consoleLogsFix,
  'unused-imports': unusedImportsFix,
  prettier: prettierFix,
  'dead-code': deadCodeFix,
};

/**
 * Get staged files from git
 */
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACMR', {
      encoding: 'utf-8',
      cwd: process.cwd(),
    });
    return output
      .trim()
      .split('\n')
      .filter(Boolean)
      .filter(file => /\.(ts|tsx|js|jsx)$/.test(file));
  } catch (error) {
    return [];
  }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    check: args.includes('--check') || (!args.includes('--fix') && !args.includes('--report')),
    fix: args.includes('--fix'),
    report: args.includes('--report'),
    staged: args.includes('--staged'),
    files: null,
  };

  // Extract --files argument
  const filesIndex = args.indexOf('--files');
  if (filesIndex !== -1 && args[filesIndex + 1]) {
    options.files = args[filesIndex + 1].split(',').map(f => f.trim());
  }

  return options;
}

/**
 * Run all checks
 */
async function runChecks(files = null) {
  const allViolations = [];
  const results = [];

  console.log('🔍 Running cleanup checks...\n');
  for (const checkModule of CHECK_MODULES) {
    try {
      console.log(`  Checking ${checkModule.name}...`);
      const result = await checkModule.check(files);
      results.push({
        name: checkModule.name,
        ...result,
      });
      allViolations.push(...result.violations);
    } catch (error) {
      console.error(`  ❌ Error checking ${checkModule.name}:`, error.message);
      results.push({
        name: checkModule.name,
        passed: false,
        violations: [],
        summary: `Error: ${error.message}`,
      });
    }
  }

  return { results, violations: allViolations };
}

/**
 * Run all fixes
 */
async function runFixes(files = null) {
  const fixResults = [];

  console.log('🔧 Running cleanup fixes...\n');
  for (const [checkName, fixModule] of Object.entries(FIX_MODULES)) {
    try {
      console.log(`  Fixing ${checkName}...`);
      const result = await fixModule.fix(files);
      fixResults.push({
        name: checkName,
        ...result,
      });
    } catch (error) {
      console.error(`  ❌ Error fixing ${checkName}:`, error.message);
      fixResults.push({
        name: checkName,
        fixed: false,
        changes: [],
        errors: [{ file: 'all', error: error.message }],
      });
    }
  }

  return fixResults;
}

/**
 * Main function
 */
async function main() {
  const options = parseArgs();

  // Determine files to check
  let files = options.files;
  if (options.staged) {
    files = getStagedFiles();
    if (files.length === 0) {
      console.log('✅ No staged files to check');
      process.exit(0);
    }
    // Enable check mode for staged files
    options.check = true;
  }

  // Run checks
  if (options.check) {
    const { results, violations } = await runChecks(files);

    // Print summary
    console.log('\n📊 Check Summary:');
    console.log('='.repeat(50));
    for (const result of results) {
      console.log(`  ${result.passed ? '✅' : '❌'} ${result.name}: ${result.summary}`);
    }

    // Print violations if any
    if (violations.length > 0) {
      console.log('\n⚠️  Violations Found:');
      const criticalViolations = filterViolationsBySeverity(violations, 'critical');
      const warningViolations = filterViolationsBySeverity(violations, 'warning');
      const infoViolations = filterViolationsBySeverity(violations, 'info');

      if (criticalViolations.length > 0) {
        console.log(`\n  Critical (${criticalViolations.length}):`);
        for (const v of criticalViolations.slice(0, 10)) {
          console.log(`    ${v.file}${v.line ? `:${v.line}` : ''} - ${v.message}`);
        }
        if (criticalViolations.length > 10) {
          console.log(`    ... and ${criticalViolations.length - 10} more`);
        }
      }

      if (warningViolations.length > 0) {
        console.log(`\n  Warning (${warningViolations.length}):`);
        for (const v of warningViolations.slice(0, 5)) {
          console.log(`    ${v.file}${v.line ? `:${v.line}` : ''} - ${v.message}`);
        }
        if (warningViolations.length > 5) {
          console.log(`    ... and ${warningViolations.length - 5} more`);
        }
      }

      // Generate reports
      if (options.report) {
        const reportDir = path.join(process.cwd(), 'cleanup-reports');
        if (!fs.existsSync(reportDir)) {
          fs.mkdirSync(reportDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const jsonPath = path.join(reportDir, `cleanup-report-${timestamp}.json`);
        const htmlPath = path.join(reportDir, `cleanup-report-${timestamp}.html`);

        generateJSONReport(violations, jsonPath);
        generateHTMLReport(violations, htmlPath);

        console.log(`\n📄 Reports generated:`);
        console.log(`  JSON: ${jsonPath}`);
        console.log(`  HTML: ${htmlPath}`);
      }

      // Exit with error code if critical violations found
      if (criticalViolations.length > 0) {
        console.log('\n❌ Critical violations found - please fix before committing');
        console.log(`\n💡 Tip: Run 'npm run cleanup:fix' to auto-fix some issues`);
        process.exit(1);
      } else if (warningViolations.length > 0 && !options.staged) {
        // Don't fail on warnings for staged files (pre-commit hook)
        console.log('\n⚠️  Warning violations found - consider fixing');
        console.log(`\n💡 Tip: Run 'npm run cleanup:fix' to auto-fix some issues`);
        process.exit(2);
      }
    } else {
      console.log('\n✅ All checks passed!');
    }
  }

  // Run fixes
  if (options.fix) {
    const fixResults = await runFixes(files);

    console.log('\n🔧 Fix Summary:');
    console.log('='.repeat(50));
    for (const result of fixResults) {
      if (result.fixed) {
        console.log(`  ✅ ${result.name}: Fixed`);
        for (const change of result.changes) {
          console.log(`     ${change.file}: ${change.changes} change(s)`);
        }
      } else {
        console.log(`  ❌ ${result.name}: Failed`);
        for (const error of result.errors) {
          console.log(`     ${error.file}: ${error.error}`);
        }
      }
    }
  }
  if (options.report && !options.check && !options.fix) {
    const { violations } = await runChecks(files);
    const reportDir = path.join(process.cwd(), 'cleanup-reports');
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonPath = path.join(reportDir, `cleanup-report-${timestamp}.json`);
    const htmlPath = path.join(reportDir, `cleanup-report-${timestamp}.html`);
    generateJSONReport(violations, jsonPath);
    generateHTMLReport(violations, htmlPath);
    console.log(`📄 Reports generated:\n  JSON: ${jsonPath}\n  HTML: ${htmlPath}`);
  }
}

// Run main function
main().catch(error => {
  console.error('❌ Cleanup script error:', error);
  process.exit(1);
});
