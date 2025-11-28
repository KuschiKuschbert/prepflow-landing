/**
 * Helpers to invalidate menu item prices.
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Invalidate recommended prices for menu items.
 */
export async function invalidateMenuItemPrices(
  menuItemIds: string[],
  context: { type: string; id: string; lockedCount: number },
): Promise<boolean> {
  if (!supabaseAdmin) {
    logger.error('[Menu Pricing Cache] Supabase admin client not available');
    return false;
  }

  if (menuItemIds.length === 0) {
    return true;
  }

  try {
    const { error: updateError } = await supabaseAdmin
      .from('menu_items')
      .update({ recommended_selling_price: null })
      .in('id', menuItemIds);

    if (updateError) {
      logger.error(`[Menu Pricing Cache] Failed to invalidate menu items with ${context.type}:`, {
        [context.type === 'recipe'
          ? 'recipeId'
          : context.type === 'dish'
            ? 'dishId'
            : 'ingredientId']: context.id,
        menuItemIds,
        error: updateError.message,
      });
      return false;
    }

    logger.dev(
      `[Menu Pricing Cache] Invalidated recommended prices for ${menuItemIds.length} menu items using ${context.type} ${context.id} (${context.lockedCount} locked menus skipped)`,
    );
    return true;
  } catch (err) {
    logger.error(`[Menu Pricing Cache] Error invalidating menu items with ${context.type}:`, err);
    return false;
  }
}
