import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { fetchMenuItem } from './fetchMenuItem';
import { syncPrice } from './syncPrice';
import { z } from 'zod';
import { updateMenuItemSchema } from './schemas';

export async function updateMenuItem(
  menuId: string,
  menuItemId: string,
  data: z.infer<typeof updateMenuItemSchema>,
): Promise<{ success: boolean; item: any; message: string } | { error: any; status: number }> {
  const { category, position, actual_selling_price } = data;

  // Fetch menu item first to get dish_id or recipe_id
  const { menuItem, error: fetchError } = await fetchMenuItem(menuId, menuItemId);
  if (fetchError) {
    return { error: fetchError, status: 500 };
  }

  const updateData: {
    category?: string;
    position?: number;
    actual_selling_price?: number | null;
  } = {};

  if (category !== undefined) updateData.category = category;
  if (position !== undefined) updateData.position = position;
  if (actual_selling_price !== undefined) {
    updateData.actual_selling_price = actual_selling_price === null ? null : actual_selling_price;
  }

  logger.dev('[Menu Item API] Updating menu item', {
    menuId,
    menuItemId,
    updateData,
    actual_selling_price,
  });

  // Update menu_items table
  const { data: updatedItem, error: updateError } = await supabaseAdmin
    .from('menu_items')
    .update(updateData)
    .eq('id', menuItemId)
    .eq('menu_id', menuId)
    .select()
    .single();

  if (updateError) {
    logger.error('[Menu Item API] Error updating menu item:', updateError);
    return {
      error: ApiErrorHandler.createError('Failed to update menu item', 'DATABASE_ERROR', 500),
      status: 500,
    };
  }

  logger.dev('[Menu Item API] Menu item updated successfully', {
    menuItemId,
    updatedItem,
    actual_selling_price: updatedItem?.actual_selling_price,
  });

  // Sync actual_selling_price to dish or recipe table
  if (actual_selling_price !== undefined) {
    logger.dev('[Menu Item API] Syncing price to dish/recipe', {
      menuItemId,
      dish_id: menuItem?.dish_id,
      recipe_id: menuItem?.recipe_id,
      actual_selling_price,
    });
    await syncPrice(menuItem!, actual_selling_price);
    logger.dev('[Menu Item API] Price sync completed', {
      menuItemId,
    });
  }

  return {
    success: true,
    item: updatedItem,
    message: 'Menu item updated successfully',
  };
}
