/**
 * Invalidate menu item prices for a specific menu.
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Invalidate cached recommended prices for all menu items in a specific menu.
 * Useful for bulk refresh operations.
 *
 * @param {string} menuId - Menu ID
 * @returns {Promise<void>} Resolves when invalidation completes
 */
export async function invalidateMenuRecommendedPrices(menuId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Menu Pricing Cache] Supabase admin client not available');
    return;
  }

  try {
    const { error: updateError } = await supabaseAdmin
      .from('menu_items')
      .update({ recommended_selling_price: null })
      .eq('menu_id', menuId);

    if (updateError) {
      logger.error('[Menu Pricing Cache] Failed to invalidate menu recommended prices:', {
        menuId,
        error: updateError.message,
      });
    } else {
      logger.dev(`[Menu Pricing Cache] Invalidated recommended prices for menu ${menuId}`);
    }
  } catch (err) {
    logger.error('[Menu Pricing Cache] Error invalidating menu recommended prices:', err);
  }
}
