import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { Menu } from './schemas';

export async function fetchMenuCounts(supabase: SupabaseClient, menus: any[]): Promise<Menu[]> {
  return Promise.all(
    menus.map(async menu => {
      const { count: itemsCount, error: itemsError } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true })
        .eq('menu_id', menu.id);

      if (itemsError) {
        logger.warn('[Menus API] Error fetching menu items count:', {
          error: itemsError.message,
          menuId: menu.id,
        });
      }

      return {
        ...menu,
        items_count: itemsCount || 0,
      } as Menu;
    }),
  );
}

export async function createNewMenu(
  supabase: SupabaseClient,
  menuName: string,
  description?: string,
): Promise<Menu> {
  const { data: newMenu, error: createError } = await supabase
    .from('menus')
    .insert({
      menu_name: menuName.trim(),
      description: description?.trim() || null,
    })
    .select()
    .single();

  if (createError) {
    logger.error('[Menus API] Database error creating menu:', {
      error: createError.message,
      code: createError.code,
      context: { endpoint: '/api/menus', operation: 'POST', table: 'menus' },
    });
    throw createError;
  }

  return newMenu as Menu;
}
