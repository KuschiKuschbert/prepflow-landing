import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import { generateQAReport, parseTestResults } from './helpers/report-generator';
import { getCollectedErrors } from './fixtures/global-error-listener';
import { writeFileSync } from 'fs';
import { join } from 'path';

class QAReporter implements Reporter {
  private testResults: Array<{
    title: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error?: string;
    steps?: string[];
  }> = [];

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting E2E test suite with ${suite.allTests().length} tests`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.testResults.push({
      title: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message,
      steps: result.steps?.map(s => s.title),
    });
  }

  onEnd(result: FullResult) {
    console.log('\n=== Test Suite Complete ===');
    console.log(`Status: ${result.status}`);
    console.log(`Duration: ${(result.duration / 1000).toFixed(2)}s`);

    // Get all collected errors
    const errors = getCollectedErrors();
    console.log(`\nTotal errors collected: ${errors.length}`);

    // Parse test results
    const testSummary = parseTestResults(this.testResults);

    // Generate QA report
    generateQAReport(errors, testSummary, 'QA_AUDIT_REPORT.md');

    console.log('\n✅ QA_AUDIT_REPORT.md generated in project root');
  }
}

export default QAReporter;
