import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { Menu } from './schemas';

/**
 * Enrich a list of menus with their item counts via parallel Supabase queries.
 *
 * @param {SupabaseClient} supabase - Authenticated Supabase client
 * @param {{ id: string }[]} menus - Menus to enrich
 * @returns {Promise<Menu[]>} Menus with `items_count` populated
 */
export async function fetchMenuCounts(
  supabase: SupabaseClient,
  menus: { id: string }[],
): Promise<Menu[]> {
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

/**
 * Insert a new menu record and return the created row.
 *
 * @param {SupabaseClient} supabase - Authenticated Supabase client
 * @param {string} menuName - Display name for the menu
 * @param {string} userId - Owner user ID
 * @param {string} [description] - Optional menu description
 * @param {string} [menuType] - Menu type (default: `'a_la_carte'`)
 * @param {number} [foodPerPersonKg] - Food weight per person in kg
 * @param {number | null} [expectedGuests] - Expected guest count
 * @returns {Promise<Menu>} Newly created menu record
 * @throws If the Supabase insert fails
 */
export async function createNewMenu(
  supabase: SupabaseClient,
  menuName: string,
  userId: string,
  description?: string,
  menuType?: string,
  foodPerPersonKg?: number,
  expectedGuests?: number | null,
): Promise<Menu> {
  const { data: newMenu, error: createError } = await supabase
    .from('menus')
    .insert({
      menu_name: menuName.trim(),
      description: description?.trim() || null,
      user_id: userId,
      menu_type: menuType || 'a_la_carte',
      food_per_person_kg: foodPerPersonKg || null,
      expected_guests: expectedGuests ?? null,
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
