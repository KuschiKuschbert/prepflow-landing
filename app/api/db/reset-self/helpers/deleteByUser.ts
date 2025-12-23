import { SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { isMissingTableError } from './isMissingTableError';

import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Delete rows from a table by user_id (dry-run or actual).
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {string} table - Table name
 * @param {string} userId - User ID
 * @param {boolean} dryRun - If true, only count rows, don't delete
 * @param {Record<string, number>} deletedCountsByTable - Object to store counts
 * @returns {Promise<void>}
 * @throws {Error} If delete fails
 */
export async function deleteByUser(
  supabase: SupabaseClient,
  table: string,
  userId: string,
  dryRun: boolean,
  deletedCountsByTable: Record<string, number>,
): Promise<void> {
  if (dryRun) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    if (
      error &&
      (isMissingTableError(error.message) ||
        /column .*user_id.* does not exist/i.test(error.message))
    ) {
      // Column missing: skip table
      deletedCountsByTable[table] = 0;
      return;
    }
    if (error) {
      logger.error('[Reset Self API] Error counting rows for delete by user:', {
        error: error.message,
        code: (error as any).code,
        table,
        userId,
      });
      throw ApiErrorHandler.createError(error.message, 'DATABASE_ERROR', 500);
    }
    deletedCountsByTable[table] = count || 0;
    return;
  }
  const { error } = await supabase.from(table).delete().eq('user_id', userId);
  if (
    error &&
    (isMissingTableError(error.message) || /column .*user_id.* does not exist/i.test(error.message))
  ) {
    // Column missing: skip table safely
    deletedCountsByTable[table] = 0;
    return;
  }
  if (error) {
    logger.error('[Reset Self API] Error deleting rows by user:', {
      error: error.message,
      code: (error as any).code,
      table,
      userId,
    });
    throw ApiErrorHandler.createError(error.message, 'DATABASE_ERROR', 500);
  }
  // Count unknown after delete; set to 0 to indicate success without count
  deletedCountsByTable[table] = deletedCountsByTable[table] || 0;
}
