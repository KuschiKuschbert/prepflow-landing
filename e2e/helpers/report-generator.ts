/**
 * Report generation for E2E tests.
 * Re-exports from focused modules to keep main file under size limit.
 */

export type { TestResultsSummary } from './report-generator/types';
export { generateQAReport } from './report-generator/qa-report';
export { generateCrawlReport } from './report-generator/crawl-report';

import type { TestResultsSummary } from './report-generator/types';

/**
 * Parse Playwright test results into summary format
 */
export function parseTestResults(testResults: any[]): TestResultsSummary {
  const summary: TestResultsSummary = {
    total: testResults.length,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0,
    tests: [],
  };

  testResults.forEach(result => {
    summary.duration += result.duration || 0;

    if (result.status === 'passed') {
      summary.passed++;
    } else if (result.status === 'failed') {
      summary.failed++;
    } else if (result.status === 'skipped') {
      summary.skipped++;
    }

    summary.tests.push({
      title: result.title || 'Unknown Test',
      status: result.status || 'unknown',
      duration: result.duration || 0,
      error: result.error?.message,
      steps: result.steps?.map((s: any) => s.title),
    });
  });

  return summary;
}
