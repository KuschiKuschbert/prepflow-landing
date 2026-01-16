import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';

/**
 * Validate clock-in request body
 */
export function validateRequest(body: unknown): { isValid: boolean; error?: NextResponse } {
  const { employee_id, latitude, longitude } = body as { employee_id?: string; latitude?: number; longitude?: number };

  if (!employee_id) {
    return {
      isValid: false,
      error: NextResponse.json(
        ApiErrorHandler.createError('Employee ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      ),
    };
  }

  if (latitude === undefined || longitude === undefined) {
    return {
      isValid: false,
      error: NextResponse.json(
        ApiErrorHandler.createError('Latitude and longitude are required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      ),
    };
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
    return {
      isValid: false,
      error: NextResponse.json(
        ApiErrorHandler.createError('Invalid GPS coordinates', 'VALIDATION_ERROR', 400),
        { status: 400 },
      ),
    };
  }

  return { isValid: true };
}
