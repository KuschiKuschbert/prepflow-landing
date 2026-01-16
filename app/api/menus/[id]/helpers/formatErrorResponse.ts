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
  const status = (err as any).status || 500;
  const errorCode = (err as any).code || 'SERVER_ERROR';
  const message = (err as any).message || 'An error occurred';

  return NextResponse.json(
    ApiErrorHandler.createError(message, errorCode, status, {
      ...(process.env.NODE_ENV === 'development' && {
        details: (err as any).details,
        timestamp: (err as any).timestamp,
      }),
    }),
    { status },
  );
}
