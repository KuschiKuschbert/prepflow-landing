/**
 * Helper for calculating recommended price for a menu item
 */

import { logger } from '@/lib/logger';
import { RawMenuItem } from '../../../../../helpers/schemas';
import { cacheRecommendedPrice } from '../../helpers/cacheRecommendedPrice';
import { StatisticsMenuItem } from './calculateStatistics';

/**
 * Calculates recommended selling price for a menu item
 *
 * @param {any} menuItem - Menu item data
 * @param {string} menuId - Menu ID
 * @returns {Promise<number | null>} Recommended price or null
 */
export async function calculateRecommendedPrice(
  menuItem: StatisticsMenuItem,
  menuId: string,
): Promise<number | null> {
  // Always recalculate to ensure we use the fixed calculation logic
  // (ignore stale cached values from old buggy calculations)
  let recommendedPrice: number | null = null;

  const dish = Array.isArray(menuItem.dishes) ? menuItem.dishes[0] : menuItem.dishes;
  const recipe = Array.isArray(menuItem.recipes) ? menuItem.recipes[0] : menuItem.recipes;

  // Always calculate dynamically based on COGS and target margin
  if (menuItem.dish_id && dish) {
    const { calculateDishSellingPrice } =
      await import('../../../../statistics/helpers/calculateDishSellingPrice');
    recommendedPrice = await calculateDishSellingPrice(dish.id);
  } else if (menuItem.recipe_id) {
    const { calculateRecipeSellingPrice } =
      await import('../../../../statistics/helpers/calculateRecipeSellingPrice');
    // calculateRecipeSellingPrice already returns per-serving price
    // (since calculateRecipeCost(recipeId, 1) returns per-serving cost)
    recommendedPrice = await calculateRecipeSellingPrice(menuItem.recipe_id);
  }

  // Cache the calculated price for future use (non-blocking)
  if (recommendedPrice != null && recommendedPrice > 0) {
    // We only need dish_id and recipe_id for cacheRecommendedPrice
    const menuItemForCache = {
      dish_id: menuItem.dish_id,
      recipe_id: menuItem.recipe_id,
    } as RawMenuItem;
    (async () => {
      try {
        if (menuItem.id) {
          await cacheRecommendedPrice(menuId, menuItem.id, menuItemForCache);
        }
      } catch (err) {
        logger.error('[Menu Item Statistics API] Failed to cache recommended price:', {
          error: err instanceof Error ? err.message : String(err),
          context: { menuId, menuItemId: menuItem.id },
        });
      }
    })();
  }

  return recommendedPrice;
}
