import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getFilterMenuId(
  supabase: SupabaseClient,
  menuIdParam: string | null,
  lockedMenuOnly: boolean,
): Promise<string | null> {
  let targetMenuId: string | null = menuIdParam || null;
  if (lockedMenuOnly && !targetMenuId) {
    const { data: lockedMenu, error: lockedMenuError } = await supabase
      .from('menus')
      .select('id')
      .eq('is_locked', true)
      .single();

    if (lockedMenuError) {
      logger.error('[Performance API] Error fetching locked menu:', {
        error: lockedMenuError.message,
        code: lockedMenuError.code,
        context: { endpoint: '/api/performance', operation: 'GET' },
      });
    } else if (lockedMenu) {
      targetMenuId = lockedMenu.id;
      logger.dev('[Performance API] Filtering by locked menu:', { menuId: targetMenuId });
    } else {
      logger.dev('[Performance API] No locked menu found, showing all dishes');
    }
  }
  return targetMenuId;
}

export async function getDishIdsForMenu(
  supabase: SupabaseClient,
  menuId: string,
): Promise<string[]> {
  const { data: menuItems, error: menuItemsError } = await supabase
    .from('menu_items')
    .select('dish_id')
    .eq('menu_id', menuId)
    .not('dish_id', 'is', null);

  if (menuItemsError) {
    logger.error('[Performance API] Error fetching menu items:', {
      error: menuItemsError.message,
      code: menuItemsError.code,
      context: { endpoint: '/api/performance', operation: 'GET', menuId },
    });
    return [];
  }

  if (menuItems && menuItems.length > 0) {
    return menuItems
      .map((item: { dish_id: unknown }) => item.dish_id)
      .filter(Boolean) as string[];
  }
  return [];
}
