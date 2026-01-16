import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getAppError } from '@/lib/utils/error';
import { NextResponse } from 'next/server';

/**
 * Handle compliance records API errors consistently.
 *
 * @param {unknown} err - Error object
 * @param {string} method - HTTP method
 * @returns {NextResponse} Error response
 */
export function handleComplianceError(err: unknown, method: string): NextResponse {
  const appError = getAppError(err);


  logger.error('[Compliance Records API] Unexpected error:', {
    error: appError.message,
    code: appError.code,
    status: appError.status,
    originalError: appError.originalError,
    context: { endpoint: '/api/compliance-records', method },
  });

  // Map to ApiErrorHandler structure
  return NextResponse.json(
    ApiErrorHandler.createError(
      process.env.NODE_ENV === 'development'
        ? appError.message
        : 'Internal server error',
      'SERVER_ERROR',
      500,
    ),
    { status: 500 },
  );
}
