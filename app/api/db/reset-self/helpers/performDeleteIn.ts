import { SupabaseClient } from '@supabase/supabase-js';

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
    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .in(idColumn, ids);
    return count || 0;
  }
  const { error } = await supabase.from(table).delete().in(idColumn, ids);
  if (error) throw new Error(error.message);
  return ids.length; // best-effort summary (items count not returned precisely)
}
