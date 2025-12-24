import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Check if employee exists
 */
export async function checkEmployee(employeeId: string): Promise<{ employee: any } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: employee, error: employeeError } = await supabaseAdmin
    .from('employees')
    .select('id')
    .eq('id', employeeId)
    .single();

  if (employeeError || !employee) {
    logger.error('[Time Attendance API] Error fetching employee or employee not found:', {
      employeeId,
      error: employeeError?.message,
      context: { endpoint: '/api/time-attendance/clock-in', operation: 'checkEmployee' },
    });
    return NextResponse.json(ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  return { employee };
}
