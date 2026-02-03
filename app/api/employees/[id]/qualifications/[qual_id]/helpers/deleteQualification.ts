import { ApiErrorHandler, type ApiError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

export async function deleteQualification(
  supabase: SupabaseClient,
  employeeId: string,
  qualificationId: string,
  userId: string,
): Promise<{ success: boolean; message: string } | { error: ApiError; status: number }> {
  // Verify qualification belongs to employee and user
  const { data: qualification, error: checkError } = await supabase
    .from('employee_qualifications')
    .select('id, employee_id')
    .eq('id', qualificationId)
    .eq('employee_id', employeeId)
    .eq('user_id', userId)
    .single();

  if (checkError || !qualification) {
    return {
      error: ApiErrorHandler.createError('Qualification not found', 'NOT_FOUND', 404),
      status: 404,
    };
  }

  const { error } = await supabase
    .from('employee_qualifications')
    .delete()
    .eq('id', qualificationId)
    .eq('user_id', userId);

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
