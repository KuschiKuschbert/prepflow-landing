/**
 * Helper for fetching paginated cleaning tasks
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Fetches paginated cleaning tasks
 *
 * @param {any} query - Pre-built Supabase query
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Page size
 * @returns {Promise<{ data: any[]; total: number }>} Paginated tasks and total count
 */
export async function fetchPaginatedTasks(
  query: any,
  page: number,
  pageSize: number,
): Promise<{ data: any[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { count, error: countError } = await supabaseAdmin
    .from('cleaning_tasks')
    .select('*', { count: 'exact', head: true });

  if (countError && (countError as any).code !== '42P01') {
    logger.error('[Cleaning Tasks API] Database error fetching count:', {
      error: countError.message,
      code: (countError as any).code,
    });
  }

  query = query.range(from, to);
  const { data, error } = await query;

  if (error) {
    const errorCode = (error as any).code;

    if (errorCode === '42P01') {
      logger.dev('[Cleaning Tasks API] Table does not exist, returning empty array');
      return { data: [], total: 0 };
    }

    logger.error('[Cleaning Tasks API] Database error fetching tasks:', {
      error: error.message,
      code: errorCode,
      context: { endpoint: '/api/cleaning-tasks', operation: 'GET', table: 'cleaning_tasks' },
    });

    throw error;
  }

  return {
    data: data || [],
    total: count || 0,
  };
}
