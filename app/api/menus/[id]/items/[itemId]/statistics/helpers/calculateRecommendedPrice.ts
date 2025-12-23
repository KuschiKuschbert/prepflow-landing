/**
 * Helper for calculating recommended price for a menu item
 */

import { logger } from '@/lib/logger';
import { cacheRecommendedPrice } from '../../helpers/cacheRecommendedPrice';

/**
 * Calculates recommended selling price for a menu item
 *
 * @param {any} menuItem - Menu item data
 * @param {string} menuId - Menu ID
 * @returns {Promise<number | null>} Recommended price or null
 */
export async function calculateRecommendedPrice(
  menuItem: any,
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
    // Extract recipe yield from array if present
    const recipeYield =
      Array.isArray(menuItem.recipes) && menuItem.recipes.length > 0
        ? (menuItem.recipes[0] as any)?.yield
        : recipe?.yield;
    const menuItemForCache = {
      ...menuItem,
      recipes: recipeYield ? { yield: recipeYield } : undefined,
    };
    (async () => {
      try {
        await cacheRecommendedPrice(menuId, menuItem.id, menuItemForCache);
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
