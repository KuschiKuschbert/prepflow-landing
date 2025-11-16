import { SupabaseClient } from '@supabase/supabase-js';
import { isMissingTableError } from './isMissingTableError';

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
    if (error) throw new Error(error.message);
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
  if (error) throw new Error(error.message);
  // Count unknown after delete; set to 0 to indicate success without count
  deletedCountsByTable[table] = deletedCountsByTable[table] || 0;
}
