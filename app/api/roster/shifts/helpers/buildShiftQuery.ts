import type { SupabaseClient } from '@supabase/supabase-js';
import type { ShiftQueryParams } from './types';

/**
 * Builds Supabase query for shifts with filters and pagination.
 */
export async function buildShiftQuery(supabase: SupabaseClient, params: ShiftQueryParams) {
  let query = supabase.from('shifts').select('*', { count: 'exact' });

  // Filter by user_id
  query = query.eq('user_id', params.userId);

  // Filter by employee
  if (params.employee_id) {
    query = query.eq('employee_id', params.employee_id);
  }

  // Filter by status
  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status);
  }

  // Filter by date range
  if (params.start_date) {
    query = query.gte('shift_date', params.start_date);
  }

  if (params.end_date) {
    query = query.lte('shift_date', params.end_date);
  }

  // Filter by specific date
  if (params.shift_date) {
    query = query.eq('shift_date', params.shift_date);
  }

  // Order by date and time
  query = query.order('shift_date', { ascending: true }).order('start_time', { ascending: true });

  // Pagination
  const page = params.page || 1;
  const pageSize = params.pageSize || 100;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  return { data, error, count };
}
