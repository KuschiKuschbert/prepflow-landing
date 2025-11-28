/**
 * Table deletion helpers for restore operations.
 */

import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Delete records from a table by user_id.
 */
async function deleteByUserId(
  supabase: SupabaseClient,
  tableName: string,
  userId: string,
): Promise<void> {
  await supabase.from(tableName).delete().eq('user_id', userId);
}

/**
 * Delete order list items via parent order lists.
 */
async function deleteOrderListItems(supabase: SupabaseClient, userId: string): Promise<void> {
  const { data: orderLists } = await supabase
    .from('order_lists')
    .select('id')
    .eq('user_id', userId);

  if (orderLists && orderLists.length > 0) {
    const orderListIds = orderLists.map(r => r.id);
    await supabase.from('order_list_items').delete().in('order_list_id', orderListIds);
  }
}

/**
 * Delete prep list items via parent prep lists.
 */
async function deletePrepListItems(supabase: SupabaseClient, userId: string): Promise<void> {
  const { data: prepLists } = await supabase.from('prep_lists').select('id').eq('user_id', userId);

  if (prepLists && prepLists.length > 0) {
    const prepListIds = prepLists.map(r => r.id);
    await supabase.from('prep_list_items').delete().in('prep_list_id', prepListIds);
  }
}

/**
 * Delete records from a table, handling child tables appropriately.
 */
export async function deleteTableRecords(
  supabase: SupabaseClient,
  tableName: string,
  userId: string,
): Promise<void> {
  // Get user's records to delete
  const { data: existingRecords } = await supabase
    .from(tableName)
    .select('id')
    .eq('user_id', userId);

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

/**
 * Delete multiple tables, collecting errors.
 */
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
