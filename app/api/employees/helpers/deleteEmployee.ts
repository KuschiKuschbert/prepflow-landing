import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Delete (deactivate) an employee.
 *
 * @param {string} id - Employee ID
 * @throws {Error} If deletion fails
 */
export async function deleteEmployee(id: string) {
  if (!supabaseAdmin) throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);

  // Soft delete by setting status to 'terminated' instead of actually deleting
  const { error } = await supabaseAdmin
    .from('employees')
    .update({
      status: 'terminated',
      employment_end_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    logger.error('[Employees API] Database error deleting employee:', {
      error: error.message,
      code: (error as any).code,
      context: {
        endpoint: '/api/employees',
        operation: 'DELETE',
        table: 'employees',
        employee_id: id,
      },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
}
