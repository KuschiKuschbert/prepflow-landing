import { logger } from '@/lib/logger';
import { MenuItemWithRelations, MenuRecipeRelation } from '../../../helpers/internal-types';
import { calculateRecipeCost } from './calculateRecipeCost';
import { calculateRecipeSellingPrice } from './calculateRecipeSellingPrice';

/**
 * Processes a recipe item for statistics calculation
 *
 * @param {MenuItemWithRelations} item - Menu item with recipe
 * @param {MenuRecipeRelation} recipe - Recipe data
 * @returns {Promise<{ cogs: number; revenue: number; margin: number | null }>} Statistics for recipe
 */
export async function processRecipeItem(
  item: MenuItemWithRelations,
  recipe: MenuRecipeRelation,
): Promise<{
  cogs: number;
  revenue: number;
  margin: number | null;
}> {
  // Calculate COGS
  let recipeCostPerServing = 0;
  try {
    recipeCostPerServing = await calculateRecipeCost(recipe.id, 1);
  } catch (err: unknown) {
    logger.error('[calculateMenuStatistics] Error calculating recipe cost:', {
      recipe_id: recipe.id,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // Price priority: menu_items.actual_selling_price > recipe.selling_price (per serving) > calculated recommended (per serving)
  // Price priority: menu_items.actual_selling_price > calculated recommended (per serving)
  let sellingPrice = item.actual_selling_price;

  // Calculate recommended price if needed
  if (sellingPrice == null) {
    try {
      sellingPrice = await calculateRecipeSellingPrice(recipe.id);
    } catch (err: unknown) {
      logger.error('[calculateMenuStatistics] Error calculating recipe selling price:', {
        recipe_id: recipe.id,
        error: err instanceof Error ? err.message : String(err),
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
