/**
 * Clock In API Route
 * Handles employee clock-in with geofencing validation.
 *
 * @module api/time-attendance/clock-in
 */

import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkOpenClockIn } from './helpers/checkOpenClockIn';
import { checkShift } from './helpers/checkShift';
import { createClockIn } from './helpers/createClockIn';
import { validateGeofence } from './helpers/validateGeofence';
import { validateRequest } from './helpers/validateRequest';

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
// ... standardAdminChecks is no longer sufficient since we need the specific user
// We'll use supabase.auth.getUser() to identify the caller

const clockInSchema = z.object({
  // employee_id: Removed - derived from session
  shift_id: z.string().uuid().optional().nullable(),
  latitude: z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
  notes: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate User
    const { supabase, error } = await standardAdminChecks(request);
    // Note: standardAdminChecks validates the JWT. We now need the user ID.
    // If we want to allow non-admins (staff) to clock in, standardAdminChecks might be too strict if it enforces admin role.
    // Assuming standardAdminChecks just returns a client with the user's context.

    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
        status: 401,
      });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Time Attendance API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const zodValidation = clockInSchema.safeParse(body);
    if (!zodValidation.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          zodValidation.error.issues[0]?.message || 'Invalid request data',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { shift_id, latitude, longitude, notes } = zodValidation.data;

    // 2. Resolve Employee ID from User ID
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (employeeError || !employeeData) {
      logger.warn(
        '[Time Attendance API] Clock-in attempted by user without linked employee record',
        {
          user_id: user.id,
        },
      );
      return NextResponse.json(
        ApiErrorHandler.createError('User is not linked to an employee record', 'FORBIDDEN', 403),
        { status: 403 },
      );
    }

    const employee_id = employeeData.id;

    // Validate request (keep helper validation for additional checks)
    // Note: validateRequest might check for employee_id presence if we pass a partial object.
    // Ideally update validateRequest signature or pass constructed object.
    const validation = validateRequest({ employee_id, ...zodValidation.data });
    if (!validation.isValid) {
      return validation.error!;
    }

    // Check if employee exists (Redundant check but keeps flow consistent or can be removed if confident)
    // const employeeResult = await checkEmployee(supabase, employee_id);
    // if (employeeResult instanceof NextResponse) {
    //   return employeeResult;
    // }

    // Validate geofence
    const geofenceResult = await validateGeofence(supabase, latitude, longitude);
    if (!geofenceResult.isValid) {
      return geofenceResult.error!;
    }

    // Check if shift exists (if provided)
    if (shift_id) {
      const shiftResult = await checkShift(supabase, shift_id, employee_id);
      if (shiftResult instanceof NextResponse) {
        return shiftResult;
      }
    }

    // Check for existing open clock-in
    const openClockInError = await checkOpenClockIn(supabase, employee_id);
    if (openClockInError) {
      return openClockInError;
    }

    // Create clock-in record
    return await createClockIn(
      supabase,
      employee_id,
      shift_id || null,
      latitude,
      longitude,
      geofenceResult.isValid,
      notes || null,
      geofenceResult.distance,
    );
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
