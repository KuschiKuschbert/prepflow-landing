import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Check if employee has an existing open clock-in
 */
export async function checkOpenClockIn(employeeId: string): Promise<NextResponse | null> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: existingAttendance, error: attendanceError } = await supabaseAdmin
    .from('time_attendance')
    .select('id')
    .eq('employee_id', employeeId)
    .is('clock_out_time', null)
    .single();

  // PGRST116 is "not found" - that's okay, no open clock-in exists
  if (attendanceError && attendanceError.code !== 'PGRST116') {
    logger.error('[Time Attendance API] Error checking for open clock-in:', {
      error: attendanceError.message,
      employeeId,
      context: { endpoint: '/api/time-attendance/clock-in', operation: 'checkOpenClockIn' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Error checking for open clock-in', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  if (existingAttendance) {
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Employee already has an open clock-in. Please clock out first.',
        'VALIDATION_ERROR',
        400,
      ),
      { status: 400 },
    );
  }

  return null;
}
