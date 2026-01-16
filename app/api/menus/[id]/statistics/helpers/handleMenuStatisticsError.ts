import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handle menu statistics API errors consistently.
 *
 * @param {Error | any} err - Error object
 * @returns {NextResponse} Error response
 */
export function handleMenuStatisticsError(err: Error | unknown): NextResponse {
  logger.error('[Menu Statistics API] Unexpected error:', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    context: { endpoint: '/api/menus/[id]/statistics', method: 'GET' },
  });

  return NextResponse.json(
    {
      error: 'Internal server error',
      message: err instanceof Error ? err.message : 'Unknown error',
    },
    { status: 500 },
  );
}
