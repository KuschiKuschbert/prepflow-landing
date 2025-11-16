import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handle recipe readiness API errors consistently.
 *
 * @param {Error | any} error - Error object
 * @returns {NextResponse} Error response
 */
export function handleRecipeReadinessError(error: Error | any): NextResponse {
  logger.error('[Recipe Readiness API] Unexpected error:', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context: { endpoint: '/api/dashboard/recipe-readiness', method: 'GET' },
  });

  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    },
    { status: 500 },
  );
}
