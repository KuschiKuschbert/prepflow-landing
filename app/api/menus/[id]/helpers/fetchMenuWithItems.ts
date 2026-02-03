import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { Menu } from '../../helpers/schemas';
import { EnrichedMenuItem } from '../../types';
import { enrichMenuItems } from './enrichment/enrichMenuItems';
import { fetchMenuItemsWithFallback } from './fetchMenuItemsWithFallback';
import { logDetailedError } from './fetchMenuWithItems.helpers';

/**
 * Fetch menu with items.
 *
 * @param {string} menuId - Menu ID
 * @returns {Promise<Menu & { items: EnrichedMenuItem[] }>} Menu with items
 * @throws {Error} If menu not found
 */
export async function fetchMenuWithItems(
  menuId: string,
  userId: string,
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

  // Enrich items with recommended prices, allergens, and dietary info
  const itemsWithRecommendedPrices = await enrichMenuItems(
    items,
    menuId,
    !pricingError,
    !dietaryError,
  );

  return {
    ...(menu as Menu),
    items: itemsWithRecommendedPrices,
  };
}
