/**
 * Clock-Out API Route
 * Handles employee clock-out with geofencing validation.
 *
 * @module api/time-attendance/clock-out
 */

import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ClockOutSchema = z.object({
  // employee_id: Removed - derived from session
  shift_id: z.string().uuid().optional().nullable(),
  clock_out_time: z.string().datetime(),
  clock_out_latitude: z.number().min(-90).max(90),
  clock_out_longitude: z.number().min(-180).max(180),
  venue_latitude: z.number().min(-90).max(90),
  venue_longitude: z.number().min(-180).max(180),
  geofence_radius_meters: z.number().min(0).default(100),
  notes: z.string().optional().nullable(),
});

// Haversine formula (kept as is)
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate User
    const { supabase, error } = await standardAdminChecks(request);
    // Note: standardAdminChecks validates the JWT. We now need the user ID.

    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401),
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = ClockOutSchema.parse(body);

    const {
      shift_id,
      clock_out_time,
      clock_out_latitude,
      clock_out_longitude,
      venue_latitude,
      venue_longitude,
      geofence_radius_meters,
      notes,
    } = validatedData;

    // 2. Resolve Employee ID from User ID
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (employeeError || !employeeData) {
      logger.warn('[Time Attendance API] Clock-out attempted by user without linked employee record', {
        user_id: user.id
      });
      return NextResponse.json(
        ApiErrorHandler.createError('User is not linked to an employee record', 'FORBIDDEN', 403),
        { status: 403 }
      );
    }

    const employee_id = employeeData.id;

    // Perform geofencing validation
    const distance = haversineDistance(
      clock_out_latitude,
      clock_out_longitude,
      venue_latitude,
      venue_longitude,
    );
    const isGeofenceValid = distance <= geofence_radius_meters;

    if (!isGeofenceValid) {
      logger.warn('[Clock-out API] Geofence violation detected:', {
        employee_id,
        distance: distance.toFixed(2),
        required_radius: geofence_radius_meters,
      });
    }

    // Find the most recent clock-in record for this employee/shift
    const { data: clockInRecord, error: fetchError } = await supabase
      .from('time_attendance')
      .select('*')
      .eq('employee_id', employee_id)
      .eq('clock_out_time', null) // Find records without clock-out
      .order('clock_in_time', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !clockInRecord) {
      if (fetchError) {
        logger.error('[Clock-out API] No active clock-in record found:', {
          employee_id,
          shift_id,
          error: fetchError.message,
        });
      }
      return NextResponse.json(
        ApiErrorHandler.createError('No active clock-in record found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    // Update the clock-in record with clock-out information
    const { data: updatedRecord, error: updateError } = await supabase
      .from('time_attendance')
      .update({
        clock_out_time,
        clock_out_latitude,
        clock_out_longitude,
        is_geofence_valid: isGeofenceValid,
        notes: isGeofenceValid
          ? notes
          : `Geofence violation: ${distance.toFixed(2)}m from venue. ${notes || ''}`.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', clockInRecord.id)
      .select()
      .single();

    if (updateError) {
      logger.error('[Clock-out API] Database error updating time attendance record:', {
        error: updateError.message,
        code: updateError.code,
        context: {
          endpoint: '/api/time-attendance/clock-out',
          operation: 'PUT',
          table: 'time_attendance',
        },
        recordId: clockInRecord.id,
      });
      const apiError = ApiErrorHandler.fromSupabaseError(updateError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json(
      {
        success: true,
        timeAttendance: updatedRecord,
        geofenceValid: isGeofenceValid,
        distance: Math.round(distance),
      },
      { status: 200 },
    );
  } catch (err) {
    logger.error('[Clock-out API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/time-attendance/clock-out', method: 'POST' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
