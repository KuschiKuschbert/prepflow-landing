import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Delete employee by ID
 */
export async function deleteEmployee(
  supabase: SupabaseClient,
  employeeId: string,
): Promise<NextResponse> {
  // Check if employee exists
  const { data: existingEmployee, error: fetchError } = await supabase
    .from('employees')
    .select('id')
    .eq('id', employeeId)
    .single();

  if (fetchError || !existingEmployee) {
    return NextResponse.json(ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  // Delete employee (shifts and related records will be deleted via CASCADE)
  const { error: deleteError } = await supabase.from('employees').delete().eq('id', employeeId);

  if (deleteError) {
    logger.error('[Staff Employees API] Database error deleting employee:', {
      error: deleteError.message,
      code: deleteError.code,
      context: { endpoint: '/api/staff/employees/[id]', operation: 'DELETE', employeeId },
    });

    const apiError = ApiErrorHandler.fromSupabaseError(deleteError, 500);
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Employee deleted successfully',
  });
}
