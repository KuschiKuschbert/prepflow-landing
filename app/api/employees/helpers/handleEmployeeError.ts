import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handle employee API errors.
 *
 * @param {unknown} err - Error object
 * @param {string} operation - Operation that failed
 * @returns {NextResponse} Error response
 */
export function handleEmployeeError(err: unknown, operation: string): NextResponse {
  logger.error(`[Employees API] Unexpected error during ${operation}:`, {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    context: { endpoint: '/api/employees', method: operation },
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
