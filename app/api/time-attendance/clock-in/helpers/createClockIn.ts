import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Create clock-in record
 */
export async function createClockIn(
  supabase: SupabaseClient,
  employeeId: string,
  shiftId: string | null,
  latitude: number,
  longitude: number,
  isGeofenceValid: boolean,
  notes: string | null,
  distance: number,
): Promise<NextResponse> {
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

  const { data: attendance, error: insertError } = await supabase
    .from('time_attendance')
    .insert(attendanceData)
    .select()
    .single();

  if (insertError) {
    logger.error('[Time Attendance API] Database error creating clock-in:', {
      error: insertError.message,
      code: (insertError as { code?: string }).code,
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
