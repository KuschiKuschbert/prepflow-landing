import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';

/**
 * Handle errors in staff employees API routes
 *
 * @param {unknown} err - Error object
 * @returns {NextResponse} Error response
 */
export function handleStaffEmployeeError(err: unknown): NextResponse {
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
