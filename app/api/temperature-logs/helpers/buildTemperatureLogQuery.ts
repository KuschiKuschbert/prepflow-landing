import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Build temperature logs query with filters and pagination.
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {Object} filters - Filter parameters
 * @param {string | null} filters.date - Exact date filter (YYYY-MM-DD)
 * @param {string | null} filters.dateFrom - Range start date (YYYY-MM-DD)
 * @param {string | null} filters.dateTo - Range end date (YYYY-MM-DD)
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
    dateFrom?: string | null;
    dateTo?: string | null;
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

  // Exact date filter (single day – takes precedence over range)
  if (filters.date) {
    query = query.eq('log_date', filters.date);
  } else {
    // Date range filter (used by equipment drawer and exports)
    if (filters.dateFrom) {
      query = query.gte('log_date', filters.dateFrom);
    }
    if (filters.dateTo) {
      query = query.lte('log_date', filters.dateTo);
    }
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
