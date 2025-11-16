import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handle dish API errors consistently.
 *
 * @param {Error | any} err - Error object
 * @param {string} method - HTTP method
 * @param {string} dishId - Optional dish ID
 * @returns {NextResponse} Error response
 */
export function handleDishError(err: Error | any, method: string, dishId?: string): NextResponse {
  logger.error('[Dishes API] Unexpected error:', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    context: { endpoint: '/api/dishes/[id]', method, dishId },
  });

  // If error has status (from ApiErrorHandler), return it directly
  if (err.status) {
    return NextResponse.json(err, { status: err.status });
  }

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
