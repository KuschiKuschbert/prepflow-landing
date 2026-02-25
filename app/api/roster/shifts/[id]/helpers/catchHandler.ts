/**
 * Shared catch handler for shifts [id] API.
 */
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

export function catchShiftsHandler(err: unknown, method: string): NextResponse {
  if (err instanceof NextResponse) return err;

  logger.error('[Shifts API] Unexpected error:', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    context: { endpoint: '/api/roster/shifts/[id]', method },
  });

  if (err && typeof err === 'object' && 'status' in err) {
    return NextResponse.json(err, { status: (err as { status: number }).status || 500 });
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
