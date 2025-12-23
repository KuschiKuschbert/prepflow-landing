/**
 * PDF export utilities for COGS analysis
 */

import type { COGSCalculation, PricingCalculation } from '../../types';
import { logger } from '@/lib/logger';
import { formatCOGSAnalysisForExport } from './htmlFormatting';

/**
 * Export COGS analysis to PDF (via API)
 *
 * @param {COGSCalculation[]} calculations - COGS calculations to export
 * @param {number} totalCOGS - Total COGS
 * @param {number} costPerPortion - Cost per portion
 * @param {PricingCalculation} pricingCalculation - Optional pricing calculation
 */
export async function exportCOGSAnalysisToPDF(
  calculations: COGSCalculation[],
  totalCOGS: number,
  costPerPortion: number,
  pricingCalculation?: PricingCalculation,
): Promise<void> {
  if (!calculations || calculations.length === 0) {
    return;
  }

  try {
    const content = formatCOGSAnalysisForExport(
      calculations,
      totalCOGS,
      costPerPortion,
      pricingCalculation,
    );

    const response = await fetch('/api/export/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'COGS Analysis',
        subtitle: 'Cost Analysis',
        content,
        totalItems: calculations.length,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cogs-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    logger.error('[exportCOGSAnalysisToPDF] Error exporting to PDF:', {
      error: error instanceof Error ? error.message : String(error),
      calculationCount: calculations.length,
    });
    throw error; // Re-throw to let caller handle
  }
}
