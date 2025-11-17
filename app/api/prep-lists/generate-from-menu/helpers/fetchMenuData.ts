import { supabaseAdmin } from '@/lib/supabase';

export async function fetchMenuData(menuId: string) {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  // Fetch menu
  const { data: menu, error: menuError } = await supabaseAdmin
    .from('menus')
    .select('id, menu_name')
    .eq('id', menuId)
    .single();

  if (menuError || !menu) {
    throw new Error('Menu not found');
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
    throw new Error(`Failed to fetch menu items: ${itemsError.message}`);
  }

  return { menu, menuItems: menuItems || [] };
}
