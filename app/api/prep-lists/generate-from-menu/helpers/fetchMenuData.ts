import { supabaseAdmin } from '@/lib/supabase';

import { ApiErrorHandler } from '@/lib/api-error-handler';

export async function fetchMenuData(menuId: string) {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Fetch menu
  const { data: menu, error: menuError } = await supabaseAdmin
    .from('menus')
    .select('id, menu_name')
    .eq('id', menuId)
    .single();

  if (menuError || !menu) {
    throw ApiErrorHandler.createError('Menu not found', 'DATABASE_ERROR', 500);
  }

  // Fetch menu items with dishes and recipes
  const { data: menuItems, error: itemsError } = await supabaseAdmin
    .from('menu_items')
    .select(
      `
      id,
      dish_id,
      recipe_id,
      category,
      dishes (
        id,
        dish_name,
        description
      ),
      recipes (
        id,
        name,
        description,
        yield,
        instructions
      )
    `,
    )
    .eq('menu_id', menuId);

  if (itemsError) {
    throw ApiErrorHandler.createError('Database error', 'DATABASE_ERROR', 500);
  }

  return { menu, menuItems: menuItems || [] };
}
