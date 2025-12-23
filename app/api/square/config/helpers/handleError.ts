import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';

/**
 * Handle errors in Square config API routes
 *
 * @param {unknown} error - Error object
 * @returns {NextResponse} Error response
 */
export function handleSquareConfigError(error: unknown): NextResponse {
  return NextResponse.json(
    ApiErrorHandler.createError(
      process.env.NODE_ENV === 'development'
        ? error instanceof Error
          ? error.message
          : 'Unknown error'
        : 'Internal server error',
      'SERVER_ERROR',
      500,
    ),
    { status: 500 },
  );
}

