import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Find menu items using a specific dish.
 */
export async function findMenuItemsWithDish(
  dishId: string,
): Promise<{ id: string; menu_id: string }[]> {
  if (!supabaseAdmin) {
    logger.error('[Menu Pricing Cache] Supabase admin client not available');
    return [];
  }

  const { data: menuItems, error: fetchError } = await supabaseAdmin
    .from('menu_items')
    .select('id, menu_id')
    .eq('dish_id', dishId);

  if (fetchError) {
    logger.error('[Menu Pricing Cache] Failed to fetch menu items with dish:', {
      dishId,
      error: fetchError.message,
    });
    return [];
  }

  return menuItems || [];
}
