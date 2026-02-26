/**
 * Helper for fetching paginated cleaning tasks
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { DBCleaningTask } from './types';

/** Supabase range query - minimal interface (Supabase .range() returns builder chain, which is PromiseLike) */
interface RangableQuery {
  range(
    from: number,
    to: number,
  ): PromiseLike<{
    data: unknown;
    error: unknown;
    count: number | null;
  }>;
}

/**
 * Fetches paginated cleaning tasks
 *
 * @param query - Pre-built Supabase query (PostgrestFilterBuilder with range)
 * @param page - Page number (1-based)
 * @param pageSize - Page size
 * @returns Paginated tasks and total count
 */
export async function fetchPaginatedTasks(
  query: RangableQuery,
  page: number,
  pageSize: number,
): Promise<{ data: DBCleaningTask[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // We need to get the count separately or ensure the query has it
  // Since query is passed in, we assumes it might already have count configured if needed,
  // but range() will return it if configured.
  const { data, error, count } = await query.range(from, to);

  if (error) {
    const pgError = error as { code: string; message: string };
    const errorCode = pgError.code;

    if (errorCode === '42P01') {
      logger.dev('[Cleaning Tasks API] Table does not exist, returning empty array');
      return { data: [], total: 0 };
    }

    logger.error('[Cleaning Tasks API] Database error fetching tasks:', {
      error: pgError.message,
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
