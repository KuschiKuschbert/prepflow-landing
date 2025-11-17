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
 * Create a new employee.
 *
 * @param {Object} employeeData - Employee data
 * @returns {Promise<Object>} Created employee
 * @throws {Error} If creation fails
 */
export async function createEmployee(employeeData: {
  employee_id?: string | null;
  full_name: string;
  role?: string | null;
  employment_start_date: string;
  employment_end_date?: string | null;
  status?: 'active' | 'inactive' | 'terminated';
  phone?: string | null;
  email?: string | null;
  emergency_contact?: string | null;
  photo_url?: string | null;
  notes?: string | null;
}) {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  const { data, error } = await supabaseAdmin
    .from('employees')
    .insert({
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
    logger.error('[Employees API] Database error creating employee:', {
      error: error.message,
      code: (error as any).code,
      context: {
        endpoint: '/api/employees',
        operation: 'POST',
        table: 'employees',
      },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data;
}
