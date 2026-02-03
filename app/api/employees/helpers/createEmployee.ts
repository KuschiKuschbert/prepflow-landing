import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { CreateEmployeeInput, Employee } from '@/types/employee';
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
 * Create a new employee.
 *
 * @param {SupabaseClient} supabase - Logged-in Supabase client
 * @param {CreateEmployeeInput} employeeData - Employee data
 * @returns {Promise<Employee>} Created employee
 * @throws {Error} If creation fails
 */
export async function createEmployee(
  supabase: SupabaseClient,
  employeeData: CreateEmployeeInput,
  userId: string,
) {
  const { data, error } = await supabase
    .from('employees')
    .insert({
      user_id: userId,
      employee_id: employeeData.employee_id || null,
      full_name: employeeData.full_name,
      role: employeeData.role || null,
      employment_start_date: employeeData.employment_start_date,
      employment_end_date: employeeData.employment_end_date || null,
      status: employeeData.status || 'active',
      phone: employeeData.phone || null,
      email: employeeData.email || null,
      emergency_contact: employeeData.emergency_contact || null,
      photo_url: employeeData.photo_url || null,
      notes: employeeData.notes || null,
    })
    .select(EMPLOYEE_SELECT)
    .single();

  if (error) {
    const pgError = error as PostgrestError;
    logger.error('[Employees API] Database error creating employee:', {
      error: pgError.message,
      code: pgError.code,
      context: {
        endpoint: '/api/employees',
        operation: 'POST',
        table: 'employees',
      },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data as Employee;
}
