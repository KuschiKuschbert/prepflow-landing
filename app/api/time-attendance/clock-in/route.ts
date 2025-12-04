/**
 * Clock In API Route
 * Handles employee clock-in with geofencing validation.
 *
 * @module api/time-attendance/clock-in
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Venue location (should be configurable, hardcoded for now)
const VENUE_LOCATION = {
  latitude: -27.6394, // Example: Brisbane, QLD
  longitude: 153.1094,
  radiusMeters: 100, // 100 meter geofence radius
};

/**
 * Calculates distance between two coordinates using Haversine formula.
 *
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @returns {number} Distance in meters
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * POST /api/time-attendance/clock-in
 * Clock in an employee with geofencing validation.
 *
 * Request body:
 * - employee_id: Employee ID (required)
 * - shift_id: Shift ID (optional, if clocking in for a specific shift)
 * - latitude: GPS latitude (required)
 * - longitude: GPS longitude (required)
 * - notes: Optional notes (optional)
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();
    const { employee_id, shift_id, latitude, longitude, notes } = body;

    if (!employee_id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        ApiErrorHandler.createError('Latitude and longitude are required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Validate coordinates
    if (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid GPS coordinates', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Check if employee exists
    const { data: employee, error: employeeError } = await supabaseAdmin
      .from('employees')
      .select('id')
      .eq('id', employee_id)
      .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404),
        {
          status: 404,
        },
      );
    }

    // Validate geofence
    const distance = calculateDistance(
      latitude,
      longitude,
      VENUE_LOCATION.latitude,
      VENUE_LOCATION.longitude,
    );
    const isGeofenceValid = distance <= VENUE_LOCATION.radiusMeters;

    if (!isGeofenceValid) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          `Clock-in location is ${Math.round(distance)}m away from venue (maximum: ${VENUE_LOCATION.radiusMeters}m)`,
          'GEOFENCE_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Check if shift exists (if provided)
    if (shift_id) {
      const { data: shift, error: shiftError } = await supabaseAdmin
        .from('shifts')
        .select('id, employee_id')
        .eq('id', shift_id)
        .single();

      if (shiftError || !shift) {
        return NextResponse.json(ApiErrorHandler.createError('Shift not found', 'NOT_FOUND', 404), {
          status: 404,
        });
      }

      // Verify employee is assigned to shift
      if (shift.employee_id !== employee_id) {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Employee is not assigned to this shift',
            'VALIDATION_ERROR',
            400,
          ),
          { status: 400 },
        );
      }
    }

    // Check for existing open clock-in (no clock-out)
    const { data: existingAttendance, error: checkError } = await supabaseAdmin
      .from('time_attendance')
      .select('id')
      .eq('employee_id', employee_id)
      .is('clock_out_time', null)
      .single();

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

    // Create clock-in record
    const clockInTime = new Date().toISOString();
    const attendanceData = {
      employee_id,
      shift_id: shift_id || null,
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
          employeeId: employee_id,
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
  } catch (err) {
    logger.error('[Time Attendance API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/time-attendance/clock-in', method: 'POST' },
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
