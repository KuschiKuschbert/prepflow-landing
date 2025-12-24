import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Handle menu API errors consistently.
 *
 * @param {Error | any} err - Error object
 * @param {string} method - HTTP method
 * @returns {NextResponse} Error response
 */
export function handleMenuError(err: Error | any, method: string): NextResponse {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorMessage = err instanceof Error ? err.message : String(err);
  const errorStack = err instanceof Error ? err.stack : undefined;

  logger.error('[Menus API] Unexpected error:', {
    error: errorMessage,
    stack: errorStack,
    ...(isDevelopment && {
      fullError: err,
      details: err.details,
      code: err.code,
    }),
    context: { endpoint: '/api/menus/[id]', method },
  });

  return NextResponse.json(
    ApiErrorHandler.createError(errorMessage, err.code || 'SERVER_ERROR', 500, {
      ...(isDevelopment && {
        details: err.details,
        stack: errorStack,
      }),
    }),
    { status: 500 },
  );
}
