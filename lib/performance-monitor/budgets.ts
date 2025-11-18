/**
 * Performance budget and goal definitions.
 */

export interface PerformanceBudget {
  lcp: number; // 2.5s
  fid: number; // 100ms
  cls: number; // 0.1
  fcp: number; // 1.8s
  ttfb: number; // 600ms
  inp: number; // 200ms
}

/**
 * Performance budgets (maximum acceptable values).
 */
export const PERFORMANCE_BUDGETS: PerformanceBudget = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  fcp: 1800,
  ttfb: 600,
  inp: 200,
};

/**
 * Performance goals (target values for optimal performance).
 */
export const PERFORMANCE_GOALS: PerformanceBudget = {
  lcp: 1500,
  fid: 50,
  cls: 0.05,
  fcp: 1200,
  ttfb: 300,
  inp: 100,
};
