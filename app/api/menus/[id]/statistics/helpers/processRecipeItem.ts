/**
 * Helper for processing recipe items in menu statistics
 */

import { logger } from '@/lib/logger';
import { calculateRecipeCost } from './calculateRecipeCost';
import { calculateRecipeSellingPrice } from './calculateRecipeSellingPrice';

/**
 * Processes a recipe item for statistics calculation
 *
 * @param {any} item - Menu item with recipe
 * @param {any} recipe - Recipe data
 * @returns {Promise<{ cogs: number; revenue: number; margin: number | null }>} Statistics for recipe
 */
export async function processRecipeItem(
  item: any,
  recipe: any,
): Promise<{
  cogs: number;
  revenue: number;
  margin: number | null;
}> {
  // Calculate COGS
  // calculateRecipeCost(recipeId, 1) already returns per-serving cost
  // (since calculateRecipeCost divides by yield internally)
  let recipeCostPerServing = 0;
  try {
    recipeCostPerServing = await calculateRecipeCost(recipe.id, 1);
  } catch (err) {
    logger.error('[calculateMenuStatistics] Error calculating recipe cost:', {
      recipe_id: recipe.id,
      error: err,
    });
  }

  // Price priority: menu_items.actual_selling_price > recipe.selling_price (per serving) > calculated recommended (per serving)
  let sellingPrice =
    item.actual_selling_price ?? (recipe.selling_price ? parseFloat(recipe.selling_price) : null);

  // Calculate recommended price if needed
  if (sellingPrice == null) {
    try {
      // calculateRecipeSellingPrice already returns per-serving price
      // (since calculateRecipeCost(recipeId, 1) returns per-serving cost)
      sellingPrice = await calculateRecipeSellingPrice(recipe.id);
    } catch (err) {
      logger.error('[calculateMenuStatistics] Error calculating recipe selling price:', {
        recipe_id: recipe.id,
        error: err,
      });
    }
  }

  // Only add to revenue and calculate margin if we have a valid selling price
  if (sellingPrice != null && sellingPrice > 0 && !isNaN(sellingPrice)) {
    const grossProfit = sellingPrice - recipeCostPerServing;
    const margin = (grossProfit / sellingPrice) * 100;
    return { cogs: recipeCostPerServing, revenue: sellingPrice, margin };
  }

  return { cogs: recipeCostPerServing, revenue: 0, margin: null };
}
