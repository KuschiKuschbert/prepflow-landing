import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Check if shift exists and employee is assigned to it
 */
export async function checkShift(
  shiftId: string,
  employeeId: string,
): Promise<{ shift: unknown } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: shift, error: shiftError } = await supabaseAdmin
    .from('shifts')
    .select('id, employee_id')
    .eq('id', shiftId)
    .single();

  if (shiftError || !shift) {
    logger.error('[Time Attendance API] Error fetching shift or shift not found:', {
      shiftId,
      employeeId,
      error: shiftError?.message,
      context: { endpoint: '/api/time-attendance/clock-in', operation: 'checkShift' },
    });
    return NextResponse.json(ApiErrorHandler.createError('Shift not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  // Verify employee is assigned to shift
  if (shift.employee_id !== employeeId) {
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Employee is not assigned to this shift',
        'VALIDATION_ERROR',
        400,
      ),
      { status: 400 },
    );
  }

  return { shift };
}
