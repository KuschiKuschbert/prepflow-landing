/**
 * Print utility for COGS analysis
 * Formats cost analysis with breakdowns
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import { formatCOGSHeader } from './printCOGSAnalysis/formatHeader';
import { formatCOGSCostTable } from './printCOGSAnalysis/formatCostTable';
import { formatCOGSPricing } from './printCOGSAnalysis/formatPricing';
import type { PrintCOGSAnalysisOptions } from './printCOGSAnalysis-types';

export type { PrintCOGSAnalysisOptions, Recipe } from './printCOGSAnalysis-types';

/**
 * Format COGS analysis for printing
 *
 * @param {PrintCOGSAnalysisOptions} options - COGS analysis print options
 * @returns {void} Opens print dialog
 */
export function printCOGSAnalysis({
  recipe,
  calculations,
  dishPortions,
  totalCOGS,
  costPerPortion,
  pricingCalculation,
  targetGrossProfit,
  pricingStrategy,
}: PrintCOGSAnalysisOptions): void {
  const content = `
    <div style="max-width: 100%;">
      ${formatCOGSHeader(recipe, dishPortions)}
      ${formatCOGSCostTable(calculations, totalCOGS, costPerPortion)}
      ${formatCOGSPricing(pricingCalculation, pricingStrategy, targetGrossProfit)}
    </div>
  `;

  const title = recipe ? recipe.recipe_name : 'Dish Cost Analysis';
  const subtitle = recipe ? 'COGS Analysis' : 'Cost Analysis';

  printWithTemplate({
    title,
    subtitle,
    content,
    totalItems: calculations.length,
    customMeta: `Total COGS: $${totalCOGS.toFixed(2)} | Cost per Portion: $${costPerPortion.toFixed(2)}`,
  });
}
