import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { RawMenuItem } from '../../../../helpers/schemas';

/**
 * Fetch menu item by ID.
 *
 * @param {string} menuId - Menu ID
 * @param {string} menuItemId - Menu item ID
 * @returns {Promise<{menuItem: RawMenuItem | null, error: NextResponse | null}>} Menu item data and error if any
 */
export async function fetchMenuItem(
  menuId: string,
  menuItemId: string,
): Promise<{
  menuItem: RawMenuItem | null;
  error: NextResponse | null;
}> {
  if (!supabaseAdmin) {
    return {
      menuItem: null,
      error: NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      ),
    };
  }

  const { data: menuItem, error: fetchError } = await supabaseAdmin
    .from('menu_items')
    .select('dish_id, recipe_id')
    .eq('id', menuItemId)
    .eq('menu_id', menuId)
    .single();

  if (fetchError || !menuItem) {
    logger.error('Error fetching menu item:', fetchError);
    return {
      menuItem: null,
      error: NextResponse.json(
        ApiErrorHandler.createError(
          fetchError?.message || 'Menu item not found',
          'NOT_FOUND',
          404,
          { message: 'Failed to fetch menu item' },
        ),
        { status: 404 },
      ),
    };
  }

  return { menuItem: menuItem as RawMenuItem, error: null };
}
