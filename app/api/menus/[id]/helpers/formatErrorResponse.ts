import { NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Format error response for menu API.
 *
 * @param {any} err - Error object with status, error, and message
 * @returns {NextResponse} Formatted error response
 */
export function formatErrorResponse(err: any): NextResponse {
  const status = err.status || 500;
  const errorCode = err.code || 'SERVER_ERROR';
  const message = err.message || 'An error occurred';

  return NextResponse.json(
    ApiErrorHandler.createError(message, errorCode, status, {
      ...(process.env.NODE_ENV === 'development' && {
        details: err.details,
        timestamp: err.timestamp,
      }),
    }),
    { status },
  );
}
