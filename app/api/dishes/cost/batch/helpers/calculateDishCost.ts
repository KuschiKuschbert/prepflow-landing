/**
 * Helper to calculate cost for a single dish.
 */

import { calculateRecipeCost } from '@/app/api/menus/[id]/statistics/helpers/calculateRecipeCost';
import { calculateRecommendedPrice } from '@/app/api/dishes/helpers/calculateRecommendedPrice';
import { logger } from '@/lib/logger';

/**
 * Calculate cost and recommended price for a single dish.
 */
export async function calculateDishCost(
  dishId: string,
  dish: any,
  dishRecipes: any[],
  dishIngredients: any[],
): Promise<{ dishId: string; cost: any } | { dishId: string; cost: null }> {
  if (!dish) {
    logger.warn(`[Dishes API] Dish ${dishId} not found in batch`);
    return { dishId, cost: null };
  }

  let totalCost = 0;

  // Calculate cost from recipes
  for (const dishRecipe of dishRecipes) {
    try {
      const recipeQuantity = parseFloat(dishRecipe.quantity) || 1;
      const recipeCost = await calculateRecipeCost(dishRecipe.recipe_id, recipeQuantity);
      totalCost += recipeCost;
    } catch (err) {
      logger.error('[Dishes API] Error calculating recipe cost in batch:', {
        dishId,
        recipeId: dishRecipe.recipe_id,
        error: err,
      });
      // Continue with other recipes instead of failing completely
    }
  }

  // Calculate cost from standalone ingredients
  for (const di of dishIngredients) {
    const ingredient = di.ingredients as any;
    if (ingredient) {
      const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
      const quantity = parseFloat(di.quantity) || 0;
      const isConsumable = ingredient.category === 'Consumables';

      // For consumables: simple calculation (no waste/yield)
      if (isConsumable) {
        totalCost += quantity * costPerUnit;
        continue;
      }

      // For regular ingredients: apply waste/yield adjustments
      const wastePercent = ingredient.trim_peel_waste_percentage || 0;
      const yieldPercent = ingredient.yield_percentage || 100;

      let adjustedCost = quantity * costPerUnit;
      if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
        adjustedCost = adjustedCost / (1 - wastePercent / 100);
      }
      adjustedCost = adjustedCost / (yieldPercent / 100);

      totalCost += adjustedCost;
    }
  }

  const sellingPrice = parseFloat(dish.selling_price) || 0;
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
