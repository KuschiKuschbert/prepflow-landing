import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handle errors in breach report API routes
 *
 * @param {unknown} error - Error object
 * @param {string} method - HTTP method (GET, POST)
 * @returns {NextResponse} Error response
 */
export function handleBreachReportError(error: unknown, method: string): NextResponse {
  // requireAdmin throws NextResponse for auth errors
  if (error instanceof NextResponse) {
    throw error;
  }

  logger.error('[Breach Report API] Unexpected error:', {
    error: error instanceof Error ? error.message : String(error),
    context: { endpoint: '/api/admin/security/breach-report', method },
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
