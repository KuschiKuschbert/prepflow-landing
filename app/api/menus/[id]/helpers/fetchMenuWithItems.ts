import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { Menu } from '../../helpers/schemas';
import { EnrichedMenuItem, RawMenuItem } from '../../types';
import { enrichMenuItems } from './enrichment/enrichMenuItems';
import { fetchMenuItemsWithFallback } from './fetchMenuItemsWithFallback';
import { logDetailedError } from './fetchMenuWithItems.helpers';

/**
 * Lightweight pass for locked menus: copies recipe_name from recipes.name for frontend compatibility.
 * Skips expensive enrichment (recommended prices, dietary aggregation).
 */
function lightenMenuItems(items: RawMenuItem[]): EnrichedMenuItem[] {
  return (items || []).map(item => {
    const result = { ...item } as EnrichedMenuItem;
    if (item.recipes && 'name' in item.recipes) {
      (result.recipes as { recipe_name?: string; name: string }).recipe_name = (
        item.recipes as { name: string }
      ).name;
    }
    return result;
  });
}

/**
 * Fetch menu with items.
 *
 * @param {string} menuId - Menu ID
 * @param {string} userId - User ID
 * @param {object} [options] - Optional flags
 * @param {boolean} [options.locked] - When true, skip expensive enrichment (use for locked read-only view)
 * @returns {Promise<Menu & { items: EnrichedMenuItem[] }>} Menu with items
 * @throws {Error} If menu not found
 */
export async function fetchMenuWithItems(
  menuId: string,
  userId: string,
  options?: { locked?: boolean },
): Promise<Menu & { items: EnrichedMenuItem[] }> {
  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Fetch menu
  const { data: menu, error: menuError } = await supabaseAdmin
    .from('menus')
    .select('*')
    .eq('id', menuId)
    .eq('user_id', userId)
    .single();

  if (menuError || !menu) {
    logDetailedError(
      menuError || { message: 'Menu not found', code: '404', details: '', hint: '' },
      'Menu not found',
      menuId,
    );
    throw ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404, {
      message: "The requested menu couldn't be found",
    });
  }

  // Fetch menu items with progressive fallback
  const { items, pricingError, dietaryError } = await fetchMenuItemsWithFallback(menuId);

  const itemsWithRecommendedPrices = options?.locked
    ? lightenMenuItems(items)
    : await enrichMenuItems(items, menuId, !pricingError, !dietaryError);

  return {
    ...(menu as Menu),
    items: itemsWithRecommendedPrices,
  };
}
