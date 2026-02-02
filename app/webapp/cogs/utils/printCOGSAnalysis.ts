/**
 * Print utility for COGS analysis
 * Formats cost analysis with breakdowns
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import type { COGSCalculation, PricingCalculation } from '@/lib/types/cogs';
import { formatCOGSHeader } from './printCOGSAnalysis/formatHeader';
import { formatCOGSCostTable } from './printCOGSAnalysis/formatCostTable';
import { formatCOGSPricing } from './printCOGSAnalysis/formatPricing';

export interface Recipe {
  id: string;
  recipe_name: string;
  yield: number;
  yield_unit: string;
}

export interface PrintCOGSAnalysisOptions {
  recipe: Recipe | null;
  calculations: COGSCalculation[];
  dishPortions: number;
  totalCOGS: number;
  costPerPortion: number;
  pricingCalculation?: PricingCalculation;
  targetGrossProfit?: number;
  pricingStrategy?: string;
}

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
