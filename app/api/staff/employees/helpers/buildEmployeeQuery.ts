import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import type { Employee } from './schemas';

interface EmployeeQueryParams {
  role?: string | null;
  employment_type?: string | null;
  search?: string | null;
  page?: number;
  pageSize?: number;
}

interface QueryResult {
  data: Employee[] | null;
  error: PostgrestError | null;
  count: number | null;
}

/**
 * Builds Supabase query for employees with filters and pagination.
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {EmployeeQueryParams} params - Query parameters
 * @returns {Promise<QueryResult>} Query result
 */
export async function buildEmployeeQuery(
  supabase: SupabaseClient,
  params: EmployeeQueryParams,
): Promise<QueryResult> {
  let query = supabase.from('employees').select('*', { count: 'exact' });

  // Filter by role
  if (params.role) {
    query = query.eq('role', params.role);
  }

  // Filter by employment type
  if (params.employment_type) {
    query = query.eq('employment_type', params.employment_type);
  }

  // Search by name or email
  if (params.search) {
    query = query.or(
      `first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,email.ilike.%${params.search}%`,
    );
  }

  // Order by name
  query = query.order('first_name', { ascending: true }).order('last_name', { ascending: true });

  // Pagination
  const page = params.page || 1;
  const pageSize = params.pageSize || 100;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  return { data: data as Employee[] | null, error, count };
}
