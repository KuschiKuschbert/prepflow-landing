/**
 * Clock In API Route
 * Handles employee clock-in with geofencing validation.
 *
 * @module api/time-attendance/clock-in
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from './helpers/validateRequest';
import { checkEmployee } from './helpers/checkEmployee';
import { validateGeofence } from './helpers/validateGeofence';
import { checkShift } from './helpers/checkShift';
import { checkOpenClockIn } from './helpers/checkOpenClockIn';
import { createClockIn } from './helpers/createClockIn';
import { z } from 'zod';

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
const clockInSchema = z.object({
  employee_id: z.string().uuid('Employee ID must be a valid UUID'),
  shift_id: z.string().uuid().optional().nullable(),
  latitude: z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
  notes: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
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

    const { employee_id, shift_id, latitude, longitude, notes } = zodValidation.data;

    // Validate request (keep helper validation for additional checks)
    const validation = validateRequest(zodValidation.data);
    if (!validation.isValid) {
      return validation.error!;
    }

    // Check if employee exists
    const employeeResult = await checkEmployee(employee_id);
    if (employeeResult instanceof NextResponse) {
      return employeeResult;
    }

    // Validate geofence
    const geofenceResult = validateGeofence(latitude, longitude);
    if (!geofenceResult.isValid) {
      return geofenceResult.error!;
    }

    // Check if shift exists (if provided)
    if (shift_id) {
      const shiftResult = await checkShift(shift_id, employee_id);
      if (shiftResult instanceof NextResponse) {
        return shiftResult;
      }
    }

    // Check for existing open clock-in
    const openClockInError = await checkOpenClockIn(employee_id);
    if (openClockInError) {
      return openClockInError;
    }

    // Create clock-in record
    return await createClockIn(
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
