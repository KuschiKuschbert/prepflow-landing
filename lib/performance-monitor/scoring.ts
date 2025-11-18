import type { PerformanceMetrics } from './metrics';
import { PERFORMANCE_BUDGETS, PERFORMANCE_GOALS } from './budgets';

/**
 * Calculate overall performance score from metrics.
 *
 * @param {PerformanceMetrics} metrics - Current performance metrics
 * @returns {number} Performance score (0-100)
 */
export function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  let score = 0;
  let count = 0;
  Object.entries(metrics).forEach(([key, value]) => {
    if (value !== null) {
      const budget = PERFORMANCE_BUDGETS[key as keyof typeof PERFORMANCE_BUDGETS];
      const goal = PERFORMANCE_GOALS[key as keyof typeof PERFORMANCE_GOALS];
      if (budget && goal) {
        score += (1 - Math.min(value / goal, 1)) * 100;
        count++;
      }
    }
  });
  return count > 0 ? Math.round(score / count) : 0;
}

/**
 * Get performance grade from score.
 *
 * @param {number} score - Performance score (0-100)
 * @returns {'A' | 'B' | 'C' | 'D' | 'F'} Performance grade
 */
export function getPerformanceGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  return score >= 60 ? 'D' : 'F';
}
