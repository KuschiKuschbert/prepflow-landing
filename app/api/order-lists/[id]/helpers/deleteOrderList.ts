import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

export async function deleteOrderList(
  supabase: SupabaseClient,
  id: string,
): Promise<{ success: boolean; message: string } | { error: unknown; status: number }> {
  if (!supabase) {
    return {
      error: ApiErrorHandler.createError(
        'Database connection not available',
        'DATABASE_ERROR',
        500,
      ),
      status: 500,
    };
  }

  const { error: deleteItemsError } = await supabase
    .from('order_list_items')
    .delete()
    .eq('order_list_id', id);

  if (deleteItemsError) {
    logger.warn('[Order Lists API] Warning: Could not delete order list items:', {
      error: deleteItemsError.message,
      code: deleteItemsError.code,
      orderListId: id,
    });
    // Continue with list deletion even if items deletion fails
  }

  const { error } = await supabase.from('order_lists').delete().eq('id', id);

  if (error) {
    logger.error('[Order Lists API] Error deleting order list:', {
      error: error.message,
      code: error.code,
      orderListId: id,
    });
    return {
      error: ApiErrorHandler.createError('Failed to delete order list', 'DATABASE_ERROR', 500, {
        details: error.message,
      }),
      status: 500,
    };
  }

  return { success: true, message: 'Order list deleted successfully' };
}
