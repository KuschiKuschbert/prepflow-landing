import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

const EMPLOYEE_SELECT = `
  *,
  employee_qualifications (
    *,
    qualification_types (
      id,
      name,
      description,
      is_required,
      default_expiry_days
    )
  )
`;

/**
 * Update an employee.
 *
 * @param {string} id - Employee ID
 * @param {Object} updates - Employee updates
 * @returns {Promise<Object>} Updated employee
 * @throws {Error} If update fails
 */
export async function updateEmployee(
  id: string,
  updates: {
    employee_id?: string | null;
    full_name?: string;
    role?: string | null;
    employment_start_date?: string;
    employment_end_date?: string | null;
    status?: 'active' | 'inactive' | 'terminated';
    phone?: string | null;
    email?: string | null;
    emergency_contact?: string | null;
    photo_url?: string | null;
    notes?: string | null;
  },
) {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  const { data, error } = await supabaseAdmin
    .from('employees')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(EMPLOYEE_SELECT)
    .single();

  if (error) {
    logger.error('[Employees API] Database error updating employee:', {
      error: error.message,
      code: (error as any).code,
      context: {
        endpoint: '/api/employees',
        operation: 'PUT',
        table: 'employees',
        employee_id: id,
      },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data;
}
