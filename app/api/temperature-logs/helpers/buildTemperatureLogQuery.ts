import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Build temperature logs query with filters and pagination.
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {Object} filters - Filter parameters
 * @param {string | null} filters.date - Date filter
 * @param {string | null} filters.type - Temperature type filter
 * @param {string | null} filters.location - Location filter
 * @param {string | null} filters.equipmentId - Equipment ID filter
 * @param {number} page - Page number
 * @param {number} pageSize - Page size
 * @returns {Promise<Object>} Query result with data, error, and count
 */
export async function buildTemperatureLogQuery(
  supabase: SupabaseClient,
  filters: {
    date?: string | null;
    type?: string | null;
    location?: string | null;
    equipmentId?: string | null;
  },
  page: number,
  pageSize: number,
) {
  let query = supabase
    .from('temperature_logs')
    .select('*', { count: 'exact' })
    .order('log_date', { ascending: false })
    .order('log_time', { ascending: false });

  if (filters.date) {
    query = query.eq('log_date', filters.date);
  }

  if (filters.type && filters.type !== 'all') {
    query = query.eq('temperature_type', filters.type);
  }

  if (filters.location) {
    query = query.eq('location', filters.location);
  }

  if (filters.equipmentId) {
    query = query.eq('equipment_id', filters.equipmentId);
  }

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  return await query;
}
