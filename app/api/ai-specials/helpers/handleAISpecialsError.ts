import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handle AI specials API errors consistently.
 *
 * @param {Error | any} error - Error object
 * @param {string} operation - Operation name (GET, POST)
 * @returns {NextResponse} Error response
 */
export function handleAISpecialsError(error: Error | any, operation: string): NextResponse {
  logger.error(`[AI Specials API] ${operation} error:`, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context: { endpoint: '/api/ai-specials', operation },
  });

  return NextResponse.json(
    {
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    },
    { status: 500 },
  );
}
