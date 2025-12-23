/**
 * Table deletion helpers for restore operations.
 */
import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';

/** Delete records from a table by user_id. */
async function deleteByUserId(
  supabase: SupabaseClient,
  tableName: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase.from(tableName).delete().eq('user_id', userId);
  if (error) {
    logger.warn('[Restore] Error deleting records by user_id:', {
      error: error.message,
      code: (error as any).code,
      context: { tableName, userId, operation: 'deleteByUserId' },
    });
  }
}

/** Delete order list items via parent order lists. */
async function deleteOrderListItems(supabase: SupabaseClient, userId: string): Promise<void> {
  const { data: orderLists, error: fetchError } = await supabase
    .from('order_lists')
    .select('id')
    .eq('user_id', userId);

  if (fetchError) {
    logger.warn('[Restore] Error fetching order lists:', {
      error: fetchError.message,
      code: (fetchError as any).code,
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
        code: (deleteError as any).code,
        context: { orderListIds, operation: 'deleteOrderListItems' },
      });
    }
  }
}

/** Delete prep list items via parent prep lists. */
async function deletePrepListItems(supabase: SupabaseClient, userId: string): Promise<void> {
  const { data: prepLists, error: fetchError } = await supabase
    .from('prep_lists')
    .select('id')
    .eq('user_id', userId);

  if (fetchError) {
    logger.warn('[Restore] Error fetching prep lists:', {
      error: fetchError.message,
      code: (fetchError as any).code,
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
        code: (deleteError as any).code,
        context: { prepListIds, operation: 'deletePrepListItems' },
      });
    }
  }
}

/** Delete records from a table, handling child tables appropriately. */
export async function deleteTableRecords(
  supabase: SupabaseClient,
  tableName: string,
  userId: string,
): Promise<void> {
  // Get user's records to delete
  const { data: existingRecords, error: fetchError } = await supabase
    .from(tableName)
    .select('id')
    .eq('user_id', userId);

  if (fetchError) {
    logger.warn('[Restore] Error fetching existing records:', {
      error: fetchError.message,
      code: (fetchError as any).code,
      context: { tableName, userId, operation: 'deleteTableRecords' },
    });
  }

  if (!existingRecords || existingRecords.length === 0) {
    return; // No records to delete
  }

  // For child tables, delete by foreign key
  if (tableName === 'order_list_items') {
    await deleteOrderListItems(supabase, userId);
  } else if (tableName === 'prep_list_items') {
    await deletePrepListItems(supabase, userId);
  } else {
    // Parent table - delete by user_id
    await deleteByUserId(supabase, tableName, userId);
  }
}

/** Delete multiple tables, collecting errors. */
export async function deleteTables(
  supabase: SupabaseClient,
  tableNames: string[],
  userId: string,
): Promise<string[]> {
  const errors: string[] = [];

  for (const tableName of tableNames) {
    try {
      await deleteTableRecords(supabase, tableName, userId);
    } catch (error: any) {
      // Skip tables that don't exist
      if (error.message?.includes('does not exist')) {
        logger.dev(`[Restore] Skipping table ${tableName}: ${error.message}`);
        continue;
      }
      errors.push(`Failed to delete ${tableName}: ${error.message}`);
    }
  }

  return errors;
}
