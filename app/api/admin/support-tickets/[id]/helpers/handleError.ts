import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handles errors for admin support tickets API routes.
 *
 * @param {unknown} error - The error to handle.
 * @param {string} method - The HTTP method (GET, PUT).
 * @returns {NextResponse} Error response.
 */
export function handleTicketApiError(error: unknown, method: string): NextResponse {
  if (error instanceof NextResponse) {
    return error;
  }

  logger.error('[Admin Support Tickets API] Unexpected error:', {
    error: error instanceof Error ? error.message : String(error),
    context: { endpoint: `/api/admin/support-tickets/[id]`, method },
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
