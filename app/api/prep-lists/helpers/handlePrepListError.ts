import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Handle prep list API catch block: NextResponse pass-through, Zod, ApiError, or generic.
 *
 * @param {unknown} err - Caught error
 * @param {string} method - HTTP method
 * @returns {NextResponse} Error response
 */
export function catchPrepListHandler(err: unknown, method: string): NextResponse {
  if (err instanceof NextResponse) return err;
  if (err instanceof z.ZodError) {
    return NextResponse.json(
      ApiErrorHandler.createError(
        err.issues[0]?.message || 'Invalid request body',
        'VALIDATION_ERROR',
        400,
      ),
      { status: 400 },
    );
  }
  if (ApiErrorHandler.isApiError(err)) {
    return NextResponse.json(ApiErrorHandler.toResponseData(err), {
      status: ApiErrorHandler.getStatus(err),
    });
  }
  return handlePrepListError(err, method);
}

/**
 * Handle prep list API errors consistently.
 *
 * @param {Error | unknown} err - Error object
 * @param {string} method - HTTP method
 * @returns {NextResponse} Error response
 */
export function handlePrepListError(err: Error | unknown, method: string): NextResponse {
  logger.error('[Prep Lists API] Unexpected error:', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    context: { endpoint: '/api/prep-lists', method },
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
