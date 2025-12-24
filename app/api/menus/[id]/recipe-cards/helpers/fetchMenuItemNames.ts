/**
 * Helper to fetch menu item names.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

/**
 * Fetch menu item names and create a map.
 */
export async function fetchMenuItemNames(
  supabase: SupabaseClient,
  menuItemIds: string[],
): Promise<Map<string, string>> {
  const { data: menuItemsWithNames, error: menuItemsError } = await supabase
    .from('menu_items')
    .select(
      `
      id,
      dish_id,
      recipe_id,
      dishes (
        dish_name
      ),
      recipes (
        name,
        recipe_name
      )
    `,
    )
    .in('id', menuItemIds);

  if (menuItemsError) {
    logger.error('[Menus API] Error fetching menu item names:', {
      error: menuItemsError.message,
      menuItemIds,
      context: { endpoint: '/api/menus/[id]/recipe-cards', operation: 'fetchMenuItemNames' },
    });
  }

  const menuItemNameMap = new Map<string, string>();
  if (menuItemsWithNames) {
    menuItemsWithNames.forEach((item: any) => {
      const recipeName = item.recipes?.recipe_name || item.recipes?.name || null;
      const name = item.dishes?.dish_name || recipeName || 'Unknown Item';
      menuItemNameMap.set(item.id, name);
    });
  }

  return menuItemNameMap;
}
