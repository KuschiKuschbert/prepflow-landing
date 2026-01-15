import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';

/**
 * Get user-specific data from a table.
 *
 * @param {string} userId - User ID (email)
 * @param {string} tableName - Table name
 * @returns {Promise<any[]>} Array of records
 */
export async function getUserTableData(
  userId: string,
  tableName: string,
): Promise<Record<string, unknown>[]> {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase.from(tableName).select('*').eq('user_id', userId);

  if (error) {
    // Skip tables that don't exist or don't have user_id column
    if (
      error.message.includes('does not exist') ||
      error.message.includes('column') ||
      error.message.includes('user_id')
    ) {
      logger.dev(`[Backup Export] Skipping table ${tableName}: ${error.message}`);
      return [];
    }
    throw ApiErrorHandler.createError('Database error', 'DATABASE_ERROR', 500);
  }

  return (data as Record<string, unknown>[]) || [];
}

/**
 * Get child table data by foreign key.
 *
 * @param {string} tableName - Child table name
 * @param {string} fkColumn - Foreign key column name
 * @param {unknown[]} parentIds - Array of parent IDs
 * @returns {Promise<Record<string, unknown>[]>} Array of child records
 */
export async function getChildTableData(
  tableName: string,
  fkColumn: string,
  parentIds: unknown[],
): Promise<Record<string, unknown>[]> {
  if (parentIds.length === 0) {
    return [];
  }

  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase.from(tableName).select('*').in(fkColumn, parentIds);

  if (error) {
    // Skip tables that don't exist
    if (error.message.includes('does not exist')) {
      logger.dev(`[Backup Export] Skipping child table ${tableName}: ${error.message}`);
      return [];
    }
    throw ApiErrorHandler.createError('Database error', 'DATABASE_ERROR', 500);
  }

  return data || [];
}
