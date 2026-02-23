/**
 * Shared types for report generation.
 */

export interface TestResultsSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  tests: Array<{
    title: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error?: string;
    steps?: string[];
  }>;
}
