/**
 * Helper to fetch menu item names.
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Fetch menu item names and create a map.
 */
export async function fetchMenuItemNames(
  supabase: SupabaseClient,
  menuItemIds: string[],
): Promise<Map<string, string>> {
  interface MenuItemNameResult {
    id: string;
    dish_id: string | null;
    recipe_id: string | null;
    dishes: { dish_name: string } | null;
    recipes: { recipe_name?: string } | null;
  }
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
    (menuItemsWithNames as unknown as MenuItemNameResult[]).forEach(item => {
      const recipeRow = item.recipes as { recipe_name?: string } | null;
      const dishRow = item.dishes as { dish_name?: string } | null;
      const recipeName = recipeRow?.recipe_name || null;
      const name = dishRow?.dish_name || recipeName || 'Unknown Item';
      menuItemNameMap.set(item.id, name);
    });
  }

  return menuItemNameMap;
}
