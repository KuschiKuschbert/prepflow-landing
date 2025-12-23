import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { logDetailedError } from './fetchMenuWithItems.helpers';
import { fetchMenuItemsWithFallback } from './fetchMenuItemsWithFallback';
import { enrichMenuItems } from './enrichment/enrichMenuItems';

/**
 * Fetch menu with items.
 *
 * @param {string} menuId - Menu ID
 * @returns {Promise<Object>} Menu with items
 * @throws {Error} If menu not found
 */
export async function fetchMenuWithItems(menuId: string) {
  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Fetch menu
  const { data: menu, error: menuError } = await supabaseAdmin
    .from('menus')
    .select('*')
    .eq('id', menuId)
    .single();

  if (menuError || !menu) {
    logDetailedError(menuError, 'Menu not found', menuId);
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
    ...menu,
    items: itemsWithRecommendedPrices,
  };
}
