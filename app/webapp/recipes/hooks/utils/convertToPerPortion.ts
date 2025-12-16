import { COGSCalculation } from '../../../cogs/types';

/**
 * Convert COGS calculations to per-portion values.
 * Divides quantities and costs by the specified number of portions.
 *
 * @param {COGSCalculation[]} calculations - Original calculations (for full recipe/dish)
 * @param {number} portions - Number of portions to divide by (e.g., recipe.yield)
 * @returns {COGSCalculation[]} Calculations scaled to per-portion values
 */
export function convertToPerPortion(
  calculations: COGSCalculation[],
  portions: number,
): COGSCalculation[] {
  if (portions <= 0) return calculations;

  return calculations.map(calc => ({
    ...calc,
    quantity: calc.quantity / portions,
    totalCost: (calc.total_cost || calc.totalCost) / portions,
    wasteAdjustedCost: calc.wasteAdjustedCost / portions,
    yieldAdjustedCost: calc.yieldAdjustedCost / portions,
    // Legacy properties
    total_cost: (calc.total_cost || calc.totalCost) / portions,
  }));
}



