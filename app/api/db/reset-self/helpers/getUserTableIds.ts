import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { isMissingTableError } from './isMissingTableError';

/**
 * Get IDs from a table filtered by user_id.
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {string} table - Table name
 * @param {string} idColumn - ID column name
 * @param {string} userId - User ID
 * @returns {Promise<string[]>} Array of IDs
 */
export async function getUserTableIds(
  supabase: SupabaseClient,
  table: string,
  idColumn: string,
  userId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from(table)
    .select(`${idColumn}`, { head: false })
    .eq('user_id', userId);
  if (
    error &&
    (isMissingTableError(error.message) || /column .*user_id.* does not exist/i.test(error.message))
  ) {
    // Column missing: return empty array (non-fatal)
    return [];
  }
  if (error) {
    logger.warn('[Reset Self API] Error fetching user table IDs (non-fatal):', {
      error: error.message,
      code: error.code,
      table,
      idColumn,
      userId,
    });
    return [];
  }
  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  return rows.map(r => r[idColumn]) as string[];
}
