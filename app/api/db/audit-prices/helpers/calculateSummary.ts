interface PriceAuditResult {
  itemId: string;
  itemName: string;
  itemType: 'dish' | 'recipe';
  menuBuilderPrice: number | null;
  recipeDishBuilderPrice: number | null;
  discrepancy: number;
  discrepancyPercent: number;
  issues: string[];
}

/**
 * Calculate summary statistics for audit results
 */
export function calculateSummary(
  auditResults: PriceAuditResult[],
  dishesCount: number,
  recipesCount: number,
): {
  totalItems: number;
  itemsWithIssues: number;
  itemsWithDiscrepancies: number;
  avgDiscrepancy: string;
  maxDiscrepancy: string;
  message: string;
} {
  const totalItems = auditResults.length;
  const itemsWithIssues = auditResults.filter(r => r.issues.length > 0).length;
  const itemsWithDiscrepancies = auditResults.filter(r => r.discrepancy > 0.01).length;
  const avgDiscrepancy = auditResults.reduce((sum, r) => sum + r.discrepancy, 0) / totalItems;
  const maxDiscrepancy = Math.max(...auditResults.map(r => r.discrepancy), 0);

  return {
    totalItems,
    itemsWithIssues,
    itemsWithDiscrepancies,
    avgDiscrepancy: avgDiscrepancy.toFixed(2),
    maxDiscrepancy: maxDiscrepancy.toFixed(2),
    message: `Audited ${totalItems} items (${dishesCount} dishes, ${recipesCount} recipes)`,
  };
}
