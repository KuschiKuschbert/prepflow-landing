import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

export async function deleteMenuItem(
  menuId: string,
  menuItemId: string,
): Promise<{ success: boolean; message: string } | { error: any; status: number }> {
  const { error } = await supabaseAdmin
    .from('menu_items')
    .delete()
    .eq('id', menuItemId)
    .eq('menu_id', menuId);

  if (error) {
    logger.error('Error deleting menu item:', error);
    return {
      error: ApiErrorHandler.createError('Failed to delete menu item', 'DATABASE_ERROR', 500),
      status: 500,
    };
  }

  return {
    success: true,
    message: 'Menu item deleted successfully',
  };
}

