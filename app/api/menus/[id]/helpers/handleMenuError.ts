import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handle menu API errors consistently.
 *
 * @param {Error | any} err - Error object
 * @param {string} method - HTTP method
 * @returns {NextResponse} Error response
 */
export function handleMenuError(err: Error | any, method: string): NextResponse {
  logger.error('[Menus API] Unexpected error:', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    context: { endpoint: '/api/menus/[id]', method },
  });

  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error',
      message: err instanceof Error ? err.message : 'Unknown error',
    },
    { status: 500 },
  );
}
