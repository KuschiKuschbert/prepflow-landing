import { ApiErrorHandler } from '@/lib/api-error-handler';
import { PostgrestError } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Format error response for menu API.
 *
 * @param {PostgrestError | any} err - Error object with status, error, and message
 * @returns {NextResponse} Formatted error response
 */
export function formatErrorResponse(err: PostgrestError | any): NextResponse {
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
