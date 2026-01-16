import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handle menu API errors consistently.
 *
 * @param {unknown} err - Error object
 * @param {string} method - HTTP method
 * @returns {NextResponse} Error response
 */
export function handleMenuError(err: unknown, method: string): NextResponse {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorMessage = err instanceof Error ? err.message : String(err);
  const errorStack = err instanceof Error ? err.stack : undefined;
  interface ErrorWithCode {
    code?: string;
    details?: unknown;
  }
  const errorCode =
    typeof err === 'object' && err !== null && 'code' in err
      ? (err as ErrorWithCode).code
      : 'SERVER_ERROR';
  const errorDetails =
    typeof err === 'object' && err !== null && 'details' in err
      ? (err as ErrorWithCode).details
      : undefined;

  logger.error('[Menus API] Unexpected error:', {
    error: errorMessage,
    stack: errorStack,
    ...(isDevelopment && {
      fullError: err,
      details: errorDetails,
      code: errorCode,
    }),
    context: { endpoint: '/api/menus/[id]', method },
  });

  return NextResponse.json(
    ApiErrorHandler.createError(errorMessage, errorCode, 500, {
      ...(isDevelopment && {
        details: errorDetails,
        stack: errorStack,
      }),
    }),
    { status: 500 },
  );
}
