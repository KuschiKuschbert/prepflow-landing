import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handle order list API errors consistently.
 *
 * @param {Error | unknown} err - Error object
 * @param {string} method - HTTP method
 * @returns {NextResponse} Error response
 */
export function handleOrderListError(err: Error | unknown, method: string): NextResponse {
  const errorMessage = err instanceof Error ? err.message : String(err);
  const errorCode = err && typeof err === 'object' && 'code' in err ? (err as Record<string, unknown>).code : undefined;
  const errorStatus = err && typeof err === 'object' && 'status' in err ? (err as Record<string, unknown>).status : undefined;

  logger.error('[Order Lists API] Unexpected error:', {
    error: errorMessage,
    code: errorCode,
    status: errorStatus,
    context: { endpoint: '/api/order-lists', method },
  });

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
