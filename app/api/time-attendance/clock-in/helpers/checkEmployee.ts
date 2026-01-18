import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Check if employee exists
 */
export async function checkEmployee(
  supabase: SupabaseClient,
  employeeId: string,
): Promise<{ employee: unknown } | NextResponse> {
  const { data: employee, error: employeeError } = await supabase
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
