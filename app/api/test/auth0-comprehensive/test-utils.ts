/**
 * Auth0 Comprehensive Test Utilities
 * Helper functions for Auth0 testing
 */

export interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  warnings: number;
}

export interface TestResults {
  timestamp: string;
  environment: string;
  tests: TestResult[];
  summary: TestSummary;
}

/**
 * Create test results structure
 */
export function createTestResults(): TestResults {
  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    tests: [],
    summary: { total: 0, passed: 0, failed: 0, warnings: 0 },
  };
}

/**
 * Add test result helper
 */
export function addTest(
  results: TestResults,
  name: string,
  status: 'pass' | 'fail' | 'warning',
  message: string,
  details?: any,
): void {
  results.tests.push({ name, status, message, details });
  results.summary.total++;
  if (status === 'pass') results.summary.passed++;
  else if (status === 'fail') results.summary.failed++;
  else results.summary.warnings++;
}
