import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Create clock-in record
 */
export async function createClockIn(
  employeeId: string,
  shiftId: string | null,
  latitude: number,
  longitude: number,
  isGeofenceValid: boolean,
  notes: string | null,
  distance: number,
): Promise<NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const clockInTime = new Date().toISOString();
  const attendanceData = {
    employee_id: employeeId,
    shift_id: shiftId || null,
    clock_in_time: clockInTime,
    clock_in_latitude: latitude,
    clock_in_longitude: longitude,
    is_geofence_valid: isGeofenceValid,
    notes: notes || null,
  };

  const { data: attendance, error: insertError } = await supabaseAdmin
    .from('time_attendance')
    .insert(attendanceData)
    .select()
    .single();

  if (insertError) {
    logger.error('[Time Attendance API] Database error creating clock-in:', {
      error: insertError.message,
      code: (insertError as any).code,
      context: {
        endpoint: '/api/time-attendance/clock-in',
        operation: 'POST',
        employeeId,
      },
    });

    const apiError = ApiErrorHandler.fromSupabaseError(insertError, 500);
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }

  return NextResponse.json({
    success: true,
    attendance,
    message: 'Clock-in successful',
    distance: Math.round(distance),
  });
}
