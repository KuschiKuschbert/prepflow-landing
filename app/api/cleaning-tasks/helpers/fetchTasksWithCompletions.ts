/**
 * Helper for fetching cleaning tasks with completions for a date range
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Fetches cleaning tasks with completions for a date range
 *
 * @param {string} startDate - Start date (ISO date string)
 * @param {string} endDate - End date (ISO date string)
 * @param {any} query - Pre-built Supabase query
 * @returns {Promise<any[]>} Tasks with completions attached
 */
export async function fetchTasksWithCompletions(
  startDate: string,
  endDate: string,
  query: unknown,
): Promise<unknown[]> {
  const { data: tasks, error: tasksError } = await query;

  if (tasksError) {
    const errorCode = (tasksError as unknown).code;

    if (errorCode === '42P01') {
      logger.dev('[Cleaning Tasks API] Table does not exist, returning empty array');
      return [];
    }

    logger.error('[Cleaning Tasks API] Database error fetching tasks:', {
      error: tasksError.message,
      code: errorCode,
      context: { endpoint: '/api/cleaning-tasks', operation: 'GET', table: 'cleaning_tasks' },
    });

    throw ApiErrorHandler.fromSupabaseError(tasksError, 500);
  }

  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Fetch completions for date range
  const taskIds = (tasks || []).map((t: unknown) => t.id);
  let completionsQuery = supabaseAdmin
    .from('cleaning_task_completions')
    .select('*')
    .gte('completion_date', startDate)
    .lte('completion_date', endDate);

  if (taskIds.length > 0) {
    completionsQuery = completionsQuery.in('task_id', taskIds);
  }

  const { data: completions, error: completionsError } = await completionsQuery;

  if (completionsError && (completionsError as unknown).code !== '42P01') {
    logger.error('[Cleaning Tasks API] Database error fetching completions:', {
      error: completionsError.message,
      code: (completionsError as unknown).code,
    });
  }

  // Group completions by task_id
  const completionsByTask = new Map<string, any[]>();
  (completions || []).forEach((c: unknown) => {
    if (!completionsByTask.has(c.task_id)) {
      completionsByTask.set(c.task_id, []);
    }
    completionsByTask.get(c.task_id)!.push(c);
  });

  // Attach completions to tasks
  const tasksWithCompletions = (tasks || []).map((task: unknown) => ({
    ...task,
    completions: completionsByTask.get(task.id) || [],
  }));

  return tasksWithCompletions;
}
