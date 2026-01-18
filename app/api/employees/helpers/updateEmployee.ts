import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { Employee, UpdateEmployeeInput } from '@/types/employee';
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

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
 * @param {SupabaseClient} supabase - Logged-in Supabase client
 * @param {string} id - Employee ID
 * @param {UpdateEmployeeInput} updates - Employee updates
 * @returns {Promise<Employee>} Updated employee
 * @throws {Error} If update fails
 */
export async function updateEmployee(
  supabase: SupabaseClient,
  id: string,
  updates: UpdateEmployeeInput,
) {
  const { data, error } = await supabase
    .from('employees')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(EMPLOYEE_SELECT)
    .single();

  if (error) {
    const pgError = error as PostgrestError;
    logger.error('[Employees API] Database error updating employee:', {
      error: pgError.message,
      code: pgError.code,
      context: {
        endpoint: '/api/employees',
        operation: 'PUT',
        table: 'employees',
        employee_id: id,
      },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data as Employee;
}
