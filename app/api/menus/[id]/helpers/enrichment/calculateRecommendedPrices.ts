/**
 * Helper for calculating recommended prices for menu items
 */

import { logger } from '@/lib/logger';
import { RawMenuItem } from '../../../types';
import { cacheRecommendedPrice } from '../../items/[itemId]/helpers/cacheRecommendedPrice';
import { calculateDishSellingPrice } from '../../statistics/helpers/calculateDishSellingPrice';
import { calculateRecipeSellingPrice } from '../../statistics/helpers/calculateRecipeSellingPrice';

/**
 * Calculates recommended price for a menu item
 *
 * @param {RawMenuItem} item - Menu item
 * @param {string} menuId - Menu ID
 * @param {boolean} hasPricingColumns - Whether pricing columns exist
 * @returns {Promise<number | null>} Recommended price or null
 */
export async function calculateRecommendedPrice(
  item: RawMenuItem,
  menuId: string,
  hasPricingColumns: boolean,
): Promise<number | null> {
  // If pricing columns exist and recommended_selling_price already exists, use it
  if (item.recommended_selling_price != null && hasPricingColumns) {
    return item.recommended_selling_price;
  }

  try {
    let recommendedPrice: number | null = null;

    if (item.dish_id && item.dishes) {
      recommendedPrice = await calculateDishSellingPrice(item.dishes.id);
    } else if (item.recipe_id) {
      recommendedPrice = await calculateRecipeSellingPrice(item.recipe_id);
    }

    // Cache the calculated price (non-blocking)
    if (recommendedPrice != null && recommendedPrice > 0 && item.id) {
      updatePriceCacheInBackground(menuId, item.id, item);
    }

    return recommendedPrice;
  } catch (err) {
    logger.error('[Menus API] Error calculating selling price:', err);
    return null;
  }
}

/**
 * Fires a non-blocking request to update the cached price
 */
function updatePriceCacheInBackground(menuId: string, itemId: string, item: RawMenuItem) {
  // Fire and forget
  (async () => {
    try {
      await cacheRecommendedPrice(menuId, itemId, item);
    } catch (err) {
      logger.error('[Menus API] Failed to cache recommended price:', {
        error: err instanceof Error ? err.message : String(err),
        context: { menuId, itemId },
      });
    }
  })();
}
