/**
 * Generate QA Audit Report - full E2E suite report.
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import type { ErrorRecord } from '../../fixtures/global-error-listener';
import type { TestResultsSummary } from './types';

export function generateQAReport(
  errors: ErrorRecord[],
  testResults: TestResultsSummary,
  outputPath: string = 'QA_AUDIT_REPORT.md',
): void {
  const report: string[] = [];

  report.push('# QA Audit Report');
  report.push('');
  report.push(`**Generated:** ${new Date().toISOString()}`);
  report.push('');

  report.push('## Summary');
  report.push('');
  report.push('### Test Results');
  report.push(`- **Total Tests:** ${testResults.total}`);
  report.push(`- **Passed:** ${testResults.passed} ✅`);
  report.push(`- **Failed:** ${testResults.failed} ❌`);
  report.push(`- **Skipped:** ${testResults.skipped} ⏭️`);
  report.push(`- **Total Duration:** ${(testResults.duration / 1000).toFixed(2)}s`);
  report.push('');

  report.push('### Error Summary');
  report.push(`- **Total Errors Collected:** ${errors.length}`);
  const errorCounts = {
    'console.error': errors.filter(e => e.type === 'console.error').length,
    'console.warn': errors.filter(e => e.type === 'console.warn').length,
    uncaught: errors.filter(e => e.type === 'uncaught').length,
    network: errors.filter(e => e.type === 'network').length,
  };
  report.push(`- **Console Errors:** ${errorCounts['console.error']}`);
  report.push(`- **Console Warnings:** ${errorCounts['console.warn']}`);
  report.push(`- **Uncaught Exceptions:** ${errorCounts['uncaught']}`);
  report.push(`- **Network Errors (4xx/5xx):** ${errorCounts['network']}`);
  report.push('');

  if (testResults.failed > 0) {
    report.push('## Failed Tests');
    report.push('');
    testResults.tests
      .filter(t => t.status === 'failed')
      .forEach(test => {
        report.push(`### ${test.title}`);
        report.push(`- **Status:** ❌ Failed`);
        report.push(`- **Duration:** ${(test.duration / 1000).toFixed(2)}s`);
        if (test.error) {
          report.push(`- **Error:** \`${test.error}\``);
        }
        if (test.steps && test.steps.length > 0) {
          report.push('- **Steps:**');
          test.steps.forEach((step, index) => {
            report.push(`  ${index + 1}. ${step}`);
          });
        }
        report.push('');
      });
  }

  if (errors.length > 0) {
    report.push('## Error Details');
    report.push('');

    const errorsByType = {
      'console.error': errors.filter(e => e.type === 'console.error'),
      'console.warn': errors.filter(e => e.type === 'console.warn'),
      uncaught: errors.filter(e => e.type === 'uncaught'),
      network: errors.filter(e => e.type === 'network'),
    };

    if (errorsByType['console.error'].length > 0) {
      report.push('### Console Errors');
      report.push('');
      errorsByType['console.error'].forEach((error, index) => {
        report.push(`#### Error ${index + 1}`);
        report.push(`- **URL:** ${error.url}`);
        report.push(`- **Message:** \`${error.message}\``);
        if (error.stack) {
          report.push(`- **Stack:** \`\`\``);
          report.push(error.stack);
          report.push(`\`\`\``);
        }
        report.push(`- **Timestamp:** ${error.timestamp}`);
        if (error.screenshot) {
          report.push(`- **Screenshot:** \`${error.screenshot}\``);
        }
        report.push('');
      });
    }

    if (errorsByType['console.warn'].length > 0) {
      report.push('### Console Warnings');
      report.push('');
      errorsByType['console.warn'].forEach((error, index) => {
        report.push(`#### Warning ${index + 1}`);
        report.push(`- **URL:** ${error.url}`);
        report.push(`- **Message:** \`${error.message}\``);
        report.push(`- **Timestamp:** ${error.timestamp}`);
        if (error.screenshot) {
          report.push(`- **Screenshot:** \`${error.screenshot}\``);
        }
        report.push('');
      });
    }

    if (errorsByType['uncaught'].length > 0) {
      report.push('### Uncaught Exceptions');
      report.push('');
      errorsByType['uncaught'].forEach((error, index) => {
        report.push(`#### Exception ${index + 1}`);
        report.push(`- **URL:** ${error.url}`);
        report.push(`- **Message:** \`${error.message}\``);
        if (error.stack) {
          report.push(`- **Stack Trace:** \`\`\``);
          report.push(error.stack);
          report.push(`\`\`\``);
        }
        report.push(`- **Timestamp:** ${error.timestamp}`);
        if (error.screenshot) {
          report.push(`- **Screenshot:** \`${error.screenshot}\``);
        }
        report.push('');
      });
    }

    if (errorsByType['network'].length > 0) {
      report.push('### Network Errors (4xx/5xx)');
      report.push('');
      errorsByType['network'].forEach((error, index) => {
        report.push(`#### Network Error ${index + 1}`);
        report.push(`- **URL:** ${error.url}`);
        report.push(`- **Status Code:** ${error.statusCode}`);
        report.push(`- **Message:** \`${error.message}\``);
        report.push(`- **Timestamp:** ${error.timestamp}`);
        if (error.screenshot) {
          report.push(`- **Screenshot:** \`${error.screenshot}\``);
        }
        report.push('');
      });
    }
  }

  report.push('## Recommendations');
  report.push('');

  const recErrorsByType = {
    'console.error': errors.filter(e => e.type === 'console.error'),
    'console.warn': errors.filter(e => e.type === 'console.warn'),
    uncaught: errors.filter(e => e.type === 'uncaught'),
    network: errors.filter(e => e.type === 'network'),
  };

  if (errors.length === 0 && testResults.failed === 0) {
    report.push('✅ **No issues found!** All tests passed and no errors were detected.');
  } else {
    if (testResults.failed > 0) {
      report.push(`- **${testResults.failed} test(s) failed** - Review failed test details above`);
    }
    if (recErrorsByType['console.error'].length > 0) {
      report.push(
        `- **${recErrorsByType['console.error'].length} console error(s)** - Fix JavaScript errors in application code`,
      );
    }
    if (recErrorsByType['uncaught'].length > 0) {
      report.push(
        `- **${recErrorsByType['uncaught'].length} uncaught exception(s)** - Add proper error handling and try-catch blocks`,
      );
    }
    if (recErrorsByType['network'].length > 0) {
      report.push(
        `- **${recErrorsByType['network'].length} network error(s)** - Check API endpoints and server responses`,
      );
    }
    if (recErrorsByType['console.warn'].length > 0) {
      report.push(
        `- **${recErrorsByType['console.warn'].length} console warning(s)** - Review warnings and address non-critical issues`,
      );
    }
  }

  report.push('');
  report.push('---');
  report.push('');
  report.push('*This report was automatically generated by Playwright E2E test suite.*');

  const fullPath = join(process.cwd(), outputPath);
  writeFileSync(fullPath, report.join('\n'), 'utf-8');
  console.log(`QA Audit Report generated: ${fullPath}`);
}
