/**
 * Helper to calculate cost for a single dish.
 */

import { calculateRecommendedPrice } from '@/app/api/dishes/helpers/calculateRecommendedPrice';
import { calculateRecipeCost } from '@/app/api/menus/[id]/statistics/helpers/calculateRecipeCost';
import { logger } from '@/lib/logger';
import { DishIngredientRecord, DishRecipeRecord } from '../../../types';

export interface BatchCostResult {
  total_cost: number;
  selling_price: number;
  gross_profit: number;
  gross_profit_margin: number;
  food_cost_percent: number;
  contributingMargin: number;
  contributingMarginPercent: number;
  recommendedPrice: number;
}

/**
 * Calculate cost and recommended price for a single dish.
 */
// Basic interfaces for batch calculation
export interface BatchDishInput {
  selling_price: string | number | null;
}

export interface BatchDishRecipeInput {
  recipe_id: string;
  quantity: string | number | null;
}

export interface BatchIngredient {
  cost_per_unit_incl_trim?: number;
  cost_per_unit?: number;
  category?: string;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
}

export interface BatchDishIngredientInput {
  ingredients: BatchIngredient | null;
  quantity: string | number | null;
}

export interface DishCostResult {
  total_cost: number;
  selling_price: number;
  gross_profit: number;
  gross_profit_margin: number;
  food_cost_percent: number;
  contributingMargin: number;
  contributingMarginPercent: number;
  recommendedPrice: number | null; // calculateRecommendedPrice can return null based on its impl, assuming number | null here
}

/**
 * Calculate cost and recommended price for a single dish.
 */
export async function calculateDishCost(
  dishId: string,
  dish: { selling_price: number | string | null } | null,
  dishRecipes: DishRecipeRecord[],
  dishIngredients: DishIngredientRecord[],
): Promise<{ dishId: string; cost: BatchCostResult } | { dishId: string; cost: null }> {
  if (!dish) {
    logger.warn(`[Dishes API] Dish ${dishId} not found in batch`);
    return { dishId, cost: null };
  }

  let totalCost = 0;

  // Calculate cost from recipes
  for (const dishRecipe of dishRecipes) {
    try {
      const recipeQuantity =
        typeof dishRecipe.quantity === 'string'
          ? parseFloat(dishRecipe.quantity)
          : dishRecipe.quantity || 1;

      const recipeCost = await calculateRecipeCost(dishRecipe.recipe_id, recipeQuantity);
      totalCost += recipeCost;
    } catch (err) {
      logger.error('[Dishes API] Error calculating recipe cost in batch:', {
        dishId,
        recipeId: dishRecipe.recipe_id,
        error: err instanceof Error ? err.message : String(err),
      });
      // Continue with other recipes instead of failing completely
    }
  }

  // Calculate cost from standalone ingredients
  for (const di of dishIngredients) {
    const ingredient = di.ingredients as Record<string, unknown> | undefined;
    if (ingredient) {
      const costPerUnit =
        (ingredient.cost_per_unit_incl_trim as number) || (ingredient.cost_per_unit as number) || 0;
      const quantity = typeof di.quantity === 'string' ? parseFloat(di.quantity) : di.quantity || 0;

      const isConsumable = ingredient.category === 'Consumables';

      // For consumables: simple calculation (no waste/yield)
      if (isConsumable) {
        totalCost += quantity * costPerUnit;
        continue;
      }

      // For regular ingredients: apply waste/yield adjustments
      const wastePercent = (ingredient.trim_peel_waste_percentage as number) || 0;
      const yieldPercent = (ingredient.yield_percentage as number) || 100;

      let adjustedCost = quantity * costPerUnit;
      if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
        adjustedCost = adjustedCost / (1 - wastePercent / 100);
      }
      adjustedCost = adjustedCost / (yieldPercent / 100);

      totalCost += adjustedCost;
    }
  }

  const sellingPrice = (dish.selling_price as number) || 0;

  const grossProfit = sellingPrice - totalCost;
  const grossProfitMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
  const foodCostPercent = sellingPrice > 0 ? (totalCost / sellingPrice) * 100 : 0;

  // Calculate contributing margin (Revenue excl GST - Food Cost)
  const gstRate = 0.1; // 10% GST for Australia
  const sellingPriceExclGST = sellingPrice / (1 + gstRate);
  const contributingMargin = sellingPriceExclGST - totalCost;
  const contributingMarginPercent =
    sellingPriceExclGST > 0 ? (contributingMargin / sellingPriceExclGST) * 100 : 0;

  // Calculate recommended price using same formula as recipes
  const recommendedPrice = calculateRecommendedPrice(totalCost);

  return {
    dishId,
    cost: {
      total_cost: totalCost,
      selling_price: sellingPrice,
      gross_profit: grossProfit,
      gross_profit_margin: grossProfitMargin,
      food_cost_percent: foodCostPercent,
      contributingMargin: contributingMargin,
      contributingMarginPercent: contributingMarginPercent,
      recommendedPrice: recommendedPrice,
    },
  };
}
