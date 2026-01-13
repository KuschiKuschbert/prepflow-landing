import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handle dish list API errors consistently.
 *
 * @param {unknown} err - Error object
 * @param {string} method - HTTP method
 * @returns {NextResponse} Error response
 */
export function handleDishListError(err: unknown, method: string): NextResponse {
  logger.error('[Dishes API] Unexpected error:', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    context: { endpoint: '/api/dishes', method },
  });

  const errorMessage =
    err instanceof Error
      ? err.message
      : typeof err === 'object' && err !== null && 'message' in err
        ? String(err.message)
        : 'Unknown error';

  return NextResponse.json(
    ApiErrorHandler.createError(
      process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      'SERVER_ERROR',
      500,
    ),
    { status: 500 },
  );
}
