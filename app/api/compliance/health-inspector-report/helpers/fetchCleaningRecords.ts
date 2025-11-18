/**
 * Fetch cleaning records
 */

import { supabaseAdmin } from '@/lib/supabase';

const CLEANING_AREAS_SELECT = `
  *,
  cleaning_areas (
    id,
    name,
    description,
    frequency_days
  )
`;

/**
 * Fetch cleaning records within a date range.
 *
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object | null>} Cleaning records with area details or null if error
 */
export async function fetchCleaningRecords(startDate: string, endDate: string) {
  if (!supabaseAdmin) return null;

  const { data: cleaningTasks, error: cleaningError } = await supabaseAdmin
    .from('cleaning_tasks')
    .select(CLEANING_AREAS_SELECT)
    .gte('assigned_date', startDate)
    .lte('assigned_date', endDate)
    .order('assigned_date', { ascending: false })
    .limit(500);

  if (cleaningError) {
    return null;
  }

  return {
    tasks: cleaningTasks || [],
    completed: cleaningTasks?.filter(t => t.status === 'completed') || [],
    pending: cleaningTasks?.filter(t => t.status === 'pending') || [],
    overdue: cleaningTasks?.filter(t => t.status === 'overdue') || [],
    total_tasks: cleaningTasks?.length || 0,
    date_range: {
      start: startDate,
      end: endDate,
    },
  };
}
