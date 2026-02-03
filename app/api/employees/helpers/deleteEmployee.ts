import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Delete (deactivate) an employee.
 *
 * @param {SupabaseClient} supabase - Logged-in Supabase client
 * @param {string} id - Employee ID
 * @throws {Error} If deletion fails
 */
export async function deleteEmployee(supabase: SupabaseClient, id: string, userId: string) {
  // Soft delete by setting status to 'terminated' instead of actually deleting
  const { error } = await supabase
    .from('employees')
    .update({
      status: 'terminated',
      employment_end_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    logger.error('[Employees API] Database error deleting employee:', {
      error: error.message,
      code: error.code,
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
