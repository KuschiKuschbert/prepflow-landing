import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Get employee by ID
 */
export async function getEmployee(supabase: SupabaseClient, employeeId: string): Promise<NextResponse> {
  const { data: employee, error: fetchError } = await supabase
    .from('employees')
    .select('*')
    .eq('id', employeeId)
    .single();

  if (fetchError || !employee) {
    if (fetchError) {
      logger.error('[Staff Employees API] Error fetching employee or employee not found:', {
        employeeId,
        error: fetchError.message,
        context: { endpoint: '/api/staff/employees/[id]', operation: 'getEmployee' },
      });
    }
    return NextResponse.json(ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  return NextResponse.json({
    success: true,
    employee,
  });
}
