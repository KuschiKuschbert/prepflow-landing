import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { deleteByUserId, deleteOrderListItems, deletePrepListItems } from './strategies';

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
      code: fetchError.code,
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      // Skip tables that don't exist
      if (message?.includes('does not exist')) {
        logger.dev(`[Restore] Skipping table ${tableName}: ${message}`);
        continue;
      }
      errors.push(`Failed to delete ${tableName}: ${message}`);
    }
  }

  return errors;
}
