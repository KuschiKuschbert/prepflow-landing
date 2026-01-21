import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Find menu items using a specific recipe.
 */
export async function findMenuItemsWithRecipe(
  recipeId: string,
): Promise<{ id: string; menu_id: string }[]> {
  if (!supabaseAdmin) {
    logger.error('[Menu Pricing Cache] Supabase admin client not available');
    return [];
  }

  const { data: menuItems, error: fetchError } = await supabaseAdmin
    .from('menu_items')
    .select('id, menu_id')
    .eq('recipe_id', recipeId);

  if (fetchError) {
    logger.error('[Menu Pricing Cache] Failed to fetch menu items with recipe:', {
      recipeId,
      error: fetchError.message,
    });
    return [];
  }

  return menuItems || [];
}
