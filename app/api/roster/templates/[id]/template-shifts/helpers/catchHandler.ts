/**
 * Shared catch handler for template-shifts API.
 */
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export function catchTemplateShiftsHandler(err: unknown, method: string): NextResponse {
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

  logger.error('[Template Shifts API] Unexpected error:', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    context: { endpoint: '/api/roster/templates/[id]/template-shifts', method },
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
