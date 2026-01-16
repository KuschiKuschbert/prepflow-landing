/**
 * Helper for fetching paginated cleaning tasks
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Fetches paginated cleaning tasks
 *
 * @param {any} query - Pre-built Supabase query
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Page size
 * @returns {Promise<{ data: any[]; total: number }>} Paginated tasks and total count
 */
export async function fetchPaginatedTasks(
  query: unknown,
  page: number,
  pageSize: number,
): Promise<{ data: unknown[]; total: number }> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { count, error: countError } = await supabaseAdmin
    .from('cleaning_tasks')
    .select('*', { count: 'exact', head: true });

  if (countError && (countError as unknown).code !== '42P01') {
    logger.error('[Cleaning Tasks API] Database error fetching count:', {
      error: countError.message,
      code: (countError as unknown).code,
    });
  }

  query = query.range(from, to);
  const { data, error } = await query;

  if (error) {
    const errorCode = (error as unknown).code;

    if (errorCode === '42P01') {
      logger.dev('[Cleaning Tasks API] Table does not exist, returning empty array');
      return { data: [], total: 0 };
    }

    logger.error('[Cleaning Tasks API] Database error fetching tasks:', {
      error: error.message,
      code: errorCode,
      context: { endpoint: '/api/cleaning-tasks', operation: 'GET', table: 'cleaning_tasks' },
    });

    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return {
    data: data || [],
    total: count || 0,
  };
}
