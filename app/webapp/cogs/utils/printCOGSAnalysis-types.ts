/**
 * Shared types for COGS print/format utilities.
 * Extracted to avoid circular dependencies.
 */

import type { COGSCalculation, PricingCalculation } from '@/lib/types/cogs';

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
