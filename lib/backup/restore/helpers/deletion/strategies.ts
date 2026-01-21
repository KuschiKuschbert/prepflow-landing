import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';

// Type-safe interface for Supabase/Postgrest errors
interface PostgrestErrorLike {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

/** Delete records from a table by user_id. */
export async function deleteByUserId(
  supabase: SupabaseClient,
  tableName: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase.from(tableName).delete().eq('user_id', userId);
  if (error) {
    logger.warn('[Restore] Error deleting records by user_id:', {
      error: error.message,
      code: (error as PostgrestErrorLike).code,
      context: { tableName, userId, operation: 'deleteByUserId' },
    });
  }
}

/** Delete order list items via parent order lists. */
export async function deleteOrderListItems(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const { data: orderLists, error: fetchError } = await supabase
    .from('order_lists')
    .select('id')
    .eq('user_id', userId);

  if (fetchError) {
    logger.warn('[Restore] Error fetching order lists:', {
      error: fetchError.message,
      code: fetchError.code,
      context: { userId, operation: 'deleteOrderListItems' },
    });
  }

  if (orderLists && orderLists.length > 0) {
    const orderListIds = orderLists.map(r => r.id);
    const { error: deleteError } = await supabase
      .from('order_list_items')
      .delete()
      .in('order_list_id', orderListIds);
    if (deleteError) {
      logger.warn('[Restore] Error deleting order list items:', {
        error: deleteError.message,
        code: deleteError.code,
        context: { orderListIds, operation: 'deleteOrderListItems' },
      });
    }
  }
}

/** Delete prep list items via parent prep lists. */
export async function deletePrepListItems(supabase: SupabaseClient, userId: string): Promise<void> {
  const { data: prepLists, error: fetchError } = await supabase
    .from('prep_lists')
    .select('id')
    .eq('user_id', userId);

  if (fetchError) {
    logger.warn('[Restore] Error fetching prep lists:', {
      error: fetchError.message,
      code: fetchError.code,
      context: { userId, operation: 'deletePrepListItems' },
    });
  }

  if (prepLists && prepLists.length > 0) {
    const prepListIds = prepLists.map(r => r.id);
    const { error: deleteError } = await supabase
      .from('prep_list_items')
      .delete()
      .in('prep_list_id', prepListIds);
    if (deleteError) {
      logger.warn('[Restore] Error deleting prep list items:', {
        error: deleteError.message,
        code: deleteError.code,
        context: { prepListIds, operation: 'deletePrepListItems' },
      });
    }
  }
}
