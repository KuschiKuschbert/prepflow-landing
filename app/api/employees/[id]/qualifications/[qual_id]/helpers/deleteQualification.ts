import { ApiErrorHandler, type ApiError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export async function deleteQualification(
  employeeId: string,
  qualificationId: string,
): Promise<{ success: boolean; message: string } | { error: ApiError; status: number }> {
  if (!supabaseAdmin) {
    return {
      error: ApiErrorHandler.createError(
        'Database connection not available',
        'DATABASE_ERROR',
        500,
      ),
      status: 500,
    };
  }

  // Verify qualification belongs to employee
  const { data: qualification, error: checkError } = await supabaseAdmin
    .from('employee_qualifications')
    .select('id, employee_id')
    .eq('id', qualificationId)
    .eq('employee_id', employeeId)
    .single();

  if (checkError || !qualification) {
    return {
      error: ApiErrorHandler.createError('Qualification not found', 'NOT_FOUND', 404),
      status: 404,
    };
  }

  const { error } = await supabaseAdmin
    .from('employee_qualifications')
    .delete()
    .eq('id', qualificationId);

  if (error) {
    logger.error('[Employee Qualifications API] Database error deleting qualification:', {
      error: error.message,
      code: error.code,
      context: {
        endpoint: '/api/employees/[id]/qualifications/[qual_id]',
        operation: 'DELETE',
        table: 'employee_qualifications',
        qualification_id: qualificationId,
      },
    });

    const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
    return { error: apiError, status: apiError.status || 500 };
  }

  return {
    success: true,
    message: 'Qualification removed successfully',
  };
}
