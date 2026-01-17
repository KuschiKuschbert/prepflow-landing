import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handle par level API errors consistently.
 *
 * @param {Error | unknown} err - Error object
 * @param {string} method - HTTP method
 * @returns {NextResponse} Error response
 */
export function handleParLevelError(err: Error | unknown, method: string): NextResponse {
  const errorMessage = err instanceof Error ? err.message : String(err);
  const errorStack = err instanceof Error ? err.stack : undefined;
  const errorCode =
    err && typeof err === 'object' && 'code' in err
      ? (err as Record<string, unknown>).code
      : undefined;
  const errorDetails = err instanceof Error ? err : { raw: err };

  logger.error('[Par Levels API] Unexpected error:', {
    error: errorMessage,
    stack: errorStack,
    code: errorCode,
    details: errorDetails,
    context: { endpoint: '/api/par-levels', method },
  });

  // Check if it's a database/table error
  if (
    errorMessage.includes('relation') ||
    errorMessage.includes('does not exist') ||
    errorCode === '42P01'
  ) {
    return NextResponse.json(
      ApiErrorHandler.createError(
        "Par levels table doesn't exist. Please run the migration script.",
        'TABLE_NOT_FOUND',
        400,
        {
          error: errorMessage,
          code: errorCode,
          instructions: [
            'The par_levels table has not been created yet.',
            'Please run the migration SQL in your Supabase SQL Editor:',
            '1. Open migrations/add-par-levels-columns.sql',
            '2. Copy the SQL and run it in Supabase SQL Editor',
            '3. Ensure the par_levels table exists with proper foreign key to ingredients',
          ],
        },
      ),
      { status: 400 },
    );
  }

  return NextResponse.json(
    ApiErrorHandler.createError(
      process.env.NODE_ENV === 'development'
        ? errorMessage || 'Unknown error'
        : 'Internal server error',
      'SERVER_ERROR',
      500,
      {
        error: errorMessage,
        code: errorCode,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack }),
      },
    ),
    { status: 500 },
  );
}
