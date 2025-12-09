/**
 * HTML export utilities for COGS analysis
 */

import { generatePrintTemplate } from '@/lib/exports/print-template';
import type { COGSCalculation, PricingCalculation } from '../../types';
import { formatCOGSAnalysisForExport } from './htmlFormatting';

/**
 * Export COGS analysis to HTML
 *
 * @param {COGSCalculation[]} calculations - COGS calculations to export
 * @param {number} totalCOGS - Total COGS
 * @param {number} costPerPortion - Cost per portion
 * @param {PricingCalculation} pricingCalculation - Optional pricing calculation
 */
export function exportCOGSAnalysisToHTML(
  calculations: COGSCalculation[],
  totalCOGS: number,
  costPerPortion: number,
  pricingCalculation?: PricingCalculation,
): void {
  if (!calculations || calculations.length === 0) {
    return;
  }

  const content = formatCOGSAnalysisForExport(
    calculations,
    totalCOGS,
    costPerPortion,
    pricingCalculation,
  );

  const html = generatePrintTemplate({
    title: 'COGS Analysis',
    subtitle: 'Cost Analysis',
    content,
    totalItems: calculations.length,
  });

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cogs-analysis-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
