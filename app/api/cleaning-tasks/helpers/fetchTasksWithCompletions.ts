/**
 * Helper for fetching cleaning tasks with completions for a date range
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { CleaningTaskWithCompletions, DBCleaningTask, DBCleaningTaskCompletion } from './types';

/**
 * Fetches cleaning tasks with their completions within a date range
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {string} startDate - Start date (ISO date string)
 * @param {string} endDate - End date (ISO date string)
 * @param {any} query - Pre-built Supabase query for cleaning tasks
 * @returns {Promise<CleaningTaskWithCompletions[]>} Tasks with completions attached
 */
export async function fetchTasksWithCompletions(
  supabase: SupabaseClient,
  startDate: string,
  endDate: string,
  query: PromiseLike<{ data: DBCleaningTask[] | null; error: PostgrestError | null }>,
): Promise<CleaningTaskWithCompletions[]> {
  // First fetch the tasks using the provided query
  const { data: tasks, error: tasksError } = await query;

  if (tasksError) {
    const errorCode = tasksError.code;

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

  if (!tasks || tasks.length === 0) {
    return [];
  }

  // Fetch completions for these tasks in the date range
  const taskIds = tasks.map(t => (t as { id: string }).id);

  const { data: completions, error: completionsError } = await supabase
    .from('cleaning_task_completions')
    .select('*')
    .in('task_id', taskIds)
    .gte('completion_date', startDate)
    .lte('completion_date', endDate);

  if (completionsError) {
    logger.error('[Cleaning Tasks API] Database error fetching completions:', {
      error: completionsError.message,
      code: completionsError.code,
    });
    // We still return tasks but without completions if it fails
  }

  // Group completions by task_id
  const completionsByTask = new Map<string, DBCleaningTaskCompletion[]>();
  (completions || []).forEach((c: DBCleaningTaskCompletion) => {
    if (!completionsByTask.has(c.task_id)) {
      completionsByTask.set(c.task_id, []);
    }
    completionsByTask.get(c.task_id)!.push(c);
  });

  // Attach completions to tasks
  return (tasks || []).map((task: DBCleaningTask) => ({
    ...task,
    completions: completionsByTask.get(task.id) || [],
  })) as CleaningTaskWithCompletions[];
}
