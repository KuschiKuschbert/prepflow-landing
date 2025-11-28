/**
 * Helper for calculating recommended prices for menu items
 */

import { logger } from '@/lib/logger';
import { calculateRecipeSellingPrice } from '../../statistics/helpers/calculateRecipeSellingPrice';
import { calculateDishSellingPrice } from '../../statistics/helpers/calculateDishSellingPrice';
import { cacheRecommendedPrice } from '../../items/[itemId]/helpers/cacheRecommendedPrice';

/**
 * Calculates recommended price for a menu item
 *
 * @param {any} item - Menu item
 * @param {string} menuId - Menu ID
 * @param {boolean} hasPricingColumns - Whether pricing columns exist
 * @returns {Promise<number | null>} Recommended price or null
 */
export async function calculateRecommendedPrice(
  item: any,
  menuId: string,
  hasPricingColumns: boolean,
): Promise<number | null> {
  // If pricing columns exist and recommended_selling_price already exists, use it
  if (item.recommended_selling_price != null && hasPricingColumns) {
    return item.recommended_selling_price;
  }

  // For dishes, calculate recommended price dynamically
  if (item.dish_id && item.dishes) {
    try {
      const recommendedPrice = await calculateDishSellingPrice(item.dishes.id);
      // Cache the calculated price (non-blocking)
      if (recommendedPrice != null && recommendedPrice > 0) {
        cacheRecommendedPrice(menuId, item.id, item).catch(err => {
          logger.error('[Menus API] Failed to cache dish recommended price:', err);
        });
      }
      return recommendedPrice;
    } catch (err) {
      logger.error('[Menus API] Error calculating dish selling price:', err);
      return null;
    }
  }

  // For recipes, calculate recommended price per serving
  if (item.recipe_id) {
    try {
      // calculateRecipeSellingPrice already returns per-serving price
      // (since calculateRecipeCost(recipeId, 1) returns per-serving cost)
      const recommendedPrice = await calculateRecipeSellingPrice(item.recipe_id);
      // Cache the calculated price (non-blocking)
      if (recommendedPrice != null && recommendedPrice > 0) {
        cacheRecommendedPrice(menuId, item.id, item).catch(err => {
          logger.error('[Menus API] Failed to cache recipe recommended price:', err);
        });
      }
      return recommendedPrice;
    } catch (err) {
      logger.error('[Menus API] Error calculating recipe selling price:', err);
      return null;
    }
  }

  return null;
}
