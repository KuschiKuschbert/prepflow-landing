import { SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Perform delete operation on a table with given IDs (dry-run or actual).
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {string} table - Table name
 * @param {string} idColumn - ID column name
 * @param {string[]} ids - Array of IDs to delete
 * @param {boolean} dryRun - If true, only count rows, don't delete
 * @returns {Promise<number>} Number of deleted/counted rows
 * @throws {Error} If delete fails
 */
export async function performDeleteIn(
  supabase: SupabaseClient,
  table: string,
  idColumn: string,
  ids: string[],
  dryRun: boolean,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  if (dryRun) {
    // Count matching rows
    const { count, error: countError } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .in(idColumn, ids);
    if (countError) {
      logger.error('[Reset Self API] Error counting rows for delete:', {
        error: countError.message,
        code: (countError as any).code,
        table,
        idColumn,
        idsCount: ids.length,
      });
      throw ApiErrorHandler.createError(countError.message, 'DATABASE_ERROR', 500);
    }
    return count || 0;
  }
  const { error } = await supabase.from(table).delete().in(idColumn, ids);
  if (error) {
    logger.error('[Reset Self API] Error deleting rows:', {
      error: error.message,
      code: (error as any).code,
      table,
      idColumn,
      idsCount: ids.length,
    });
    throw ApiErrorHandler.createError(error.message, 'DATABASE_ERROR', 500);
  }
  return ids.length; // best-effort summary (items count not returned precisely)
}
