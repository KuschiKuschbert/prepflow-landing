import { ApiErrorHandler } from '@/lib/api-error-handler';
import { PostgrestError } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Format error response for menu API.
 *
 * @param {PostgrestError | any} err - Error object with status, error, and message
 * @returns {NextResponse} Formatted error response
 */
export function formatErrorResponse(err: PostgrestError | unknown): NextResponse {
  const error = err as Record<string, unknown>;
  const status = (error.status as number) || 500;
  const errorCode = (error.code as string) || 'SERVER_ERROR';
  const message = (error.message as string) || 'An error occurred';

  return NextResponse.json(
    ApiErrorHandler.createError(message, errorCode, status, {
      ...(process.env.NODE_ENV === 'development' && {
        details: error.details,
        timestamp: error.timestamp,
      }),
    }),
    { status },
  );
}
