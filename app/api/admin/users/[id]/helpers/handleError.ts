import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Handles errors for admin user API routes.
 *
 * @param {unknown} error - The error to handle.
 * @param {string} method - The HTTP method (GET, PUT, DELETE).
 * @returns {NextResponse} Error response.
 */
export function handleUserApiError(error: unknown, method: string): NextResponse {
  if (error instanceof NextResponse) {
    return error;
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      ApiErrorHandler.createError('Invalid request data', 'VALIDATION_ERROR', 400, error.issues),
      { status: 400 },
    );
  }

  logger.error('[Admin User API] Unexpected error:', {
    error: error instanceof Error ? error.message : String(error),
    context: { endpoint: '/api/admin/users/[id]', method },
  });

  return NextResponse.json(
    ApiErrorHandler.createError(
      process.env.NODE_ENV === 'development'
        ? error instanceof Error
          ? error.message
          : 'Unknown error'
        : 'Internal server error',
      'SERVER_ERROR',
      500,
    ),
    { status: 500 },
  );
}
