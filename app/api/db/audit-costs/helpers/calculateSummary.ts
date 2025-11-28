/**
 * Helper to calculate audit summary statistics.
 */

import type { AuditResult, AuditSummary } from '../types';

/**
 * Calculate summary statistics from audit results.
 */
export function calculateSummary(auditResults: AuditResult[]): AuditSummary {
  const totalDishes = auditResults.length;
  const dishesWithIssues = auditResults.filter(r => r.issues.length > 0).length;
  const dishesWithDiscrepancies = auditResults.filter(r => r.discrepancy > 0.01).length;
  const avgDiscrepancy = auditResults.reduce((sum, r) => sum + r.discrepancy, 0) / totalDishes;
  const maxDiscrepancy = Math.max(...auditResults.map(r => r.discrepancy));

  return {
    totalDishes,
    dishesWithIssues,
    dishesWithDiscrepancies,
    avgDiscrepancy: avgDiscrepancy.toFixed(2),
    maxDiscrepancy: maxDiscrepancy.toFixed(2),
  };
}
