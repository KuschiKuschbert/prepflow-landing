/**
 * Helper to fetch menu items for a menu.
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

import { ApiErrorHandler } from '@/lib/api-error-handler';

export interface MenuItem {
  id: string;
  category: string;
  position: number;
  dish_id: string | null;
  recipe_id: string | null;
}

/**
 * Fetch menu items for a menu.
 */
export async function fetchMenuItems(
  supabase: SupabaseClient,
  menuId: string,
): Promise<{
  items: MenuItem[];
  itemOrderMap: Map<string, { category: string; position: number }>;
}> {
  const { data: menuItems, error: itemsError } = await supabase
    .from('menu_items')
    .select('id, category, position, dish_id, recipe_id')
    .eq('menu_id', menuId)
    .order('category', { ascending: true })
    .order('position', { ascending: true });

  if (itemsError) {
    logger.error('Failed to fetch menu items:', itemsError);
    throw ApiErrorHandler.createError('Database error', 'DATABASE_ERROR', 500);
  }

  const items = (menuItems || []) as MenuItem[];

  // Create a map for ordering
  const itemOrderMap = new Map<string, { category: string; position: number }>();
  items.forEach(item => {
    itemOrderMap.set(item.id, {
      category: item.category || '',
      position: item.position || 0,
    });
  });

  return { items, itemOrderMap };
}
