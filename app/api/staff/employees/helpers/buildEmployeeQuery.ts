/**
 * Builds Supabase query for employees with filters and pagination.
 *
 * @param {any} supabase - Supabase client
 * @param {any} params - Query parameters
 * @returns {Promise<{ data: any; error: any; count: number | null }>} Query result
 */
export async function buildEmployeeQuery(supabase: any, params: any) {
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

  return { data, error, count };
}
