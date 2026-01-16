/**
 * Helper for fetching paginated cleaning tasks
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { DBCleaningTask } from './types';

/**
 * Fetches paginated cleaning tasks
 *
 * @param {any} query - Pre-built Supabase query
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Page size
 * @returns {Promise<{ data: DBCleaningTask[]; total: number }>} Paginated tasks and total count
 */
export async function fetchPaginatedTasks(
  query: any,
  page: number,
  pageSize: number,
): Promise<{ data: DBCleaningTask[]; total: number }> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // We need to get the count separately or ensure the query has it
  // Since query is passed in, we assumes it might already have count configured if needed,
  // but range() will return it if configured.
  const { data, error, count } = await query.range(from, to);

  if (error) {
    const errorCode = error.code;

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
    data: (data || []) as DBCleaningTask[],
    total: count || 0,
  };
}
