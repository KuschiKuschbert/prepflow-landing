import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { RawMenuItem } from '../../../../types';
import { calculateDishSellingPrice } from '../../../statistics/helpers/calculateDishSellingPrice';
import { calculateRecipeSellingPrice } from '../../../statistics/helpers/calculateRecipeSellingPrice';

/**
 * Cache recommended selling price for a menu item.
 * Calculates and stores the recommended price in menu_items.recommended_selling_price.
 *
 * @param {string} menuId - Menu ID
 * @param {string} menuItemId - Menu item ID
 * @param {RawMenuItem} menuItem - Menu item with dish_id or recipe_id
 * @returns {Promise<number | null>} Cached recommended price or null if calculation failed
 */
export async function cacheRecommendedPrice(
  menuId: string,
  menuItemId: string,
  menuItem: RawMenuItem,
): Promise<number | null> {
  if (!supabaseAdmin) {
    logger.error('[Cache Recommended Price] Supabase not available');
    return null;
  }

  try {
    let recommendedPrice: number | null = null;

    // Calculate recommended price based on dish or recipe
    if (menuItem.dish_id) {
      recommendedPrice = await calculateDishSellingPrice(menuItem.dish_id);
    } else if (menuItem.recipe_id) {
      // calculateRecipeSellingPrice already returns per-serving price
      // (since calculateRecipeCost(recipeId, 1) returns per-serving cost)
      recommendedPrice = await calculateRecipeSellingPrice(menuItem.recipe_id);
    }

    // Cache the calculated price
    if (recommendedPrice != null && recommendedPrice > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('menu_items')
        .update({ recommended_selling_price: recommendedPrice })
        .eq('id', menuItemId)
        .eq('menu_id', menuId);

      if (updateError) {
        logger.error('[Cache Recommended Price] Failed to cache price:', {
          menuId,
          menuItemId,
          error: updateError.message,
        });
        return null;
      }

      logger.dev('[Cache Recommended Price] Cached recommended price:', {
        menuId,
        menuItemId,
        recommendedPrice,
      });
    }

    return recommendedPrice;
  } catch (err: unknown) {
    logger.error('[Cache Recommended Price] Error calculating/caching price:', err);
    return null;
  }
}

/**
 * Refresh recommended prices for all menu items in a menu.
 * Useful when ingredient costs or recipes change.
 *
 * @param {string} menuId - Menu ID
 * @returns {Promise<{ updated: number; failed: number }>} Count of updated and failed items
 */
export async function refreshMenuRecommendedPrices(menuId: string): Promise<{
  updated: number;
  failed: number;
}> {
  if (!supabaseAdmin) {
    logger.error('[Refresh Menu Prices] Supabase not available');
    return { updated: 0, failed: 0 };
  }

  try {
    // Fetch all menu items with dish/recipe info
    const { data: menuItems, error: fetchError } = await supabaseAdmin
      .from('menu_items')
      .select(
        `
        id,
        dish_id,
        recipe_id,
        dishes (
          id
        ),
        recipes (
          id,
          yield
        )
      `,
      )
      .eq('menu_id', menuId);

    if (fetchError || !menuItems) {
      logger.error('[Refresh Menu Prices] Failed to fetch menu items:', fetchError);
      return { updated: 0, failed: 0 };
    }

    let updated = 0;
    let failed = 0;

    // Cache recommended prices for all items
    for (const item of menuItems) {
      const recipesArr = item.recipes as
        | { id: string; yield: number }[]
        | { id: string; yield: number }
        | null;
      const recipeData = Array.isArray(recipesArr) ? recipesArr[0] : recipesArr;
      const _recipeYield = recipeData?.yield;

      const menuItemForCache: RawMenuItem = {
        dish_id: item.dish_id,
        recipe_id: item.recipe_id,
        // We cast to RawMenuItem to match cacheRecommendedPrice expectations
        // The helper mainly needs dish_id or recipe_id
      };

      const price = await cacheRecommendedPrice(menuId, item.id, menuItemForCache);
      if (price != null) {
        updated++;
      } else {
        failed++;
      }
    }

    logger.dev('[Refresh Menu Prices] Refresh complete:', {
      menuId,
      total: menuItems.length,
      updated,
      failed,
    });

    return { updated, failed };
  } catch (err: unknown) {
    logger.error('[Refresh Menu Prices] Error refreshing prices:', err);
    return { updated: 0, failed: 0 };
  }
}
