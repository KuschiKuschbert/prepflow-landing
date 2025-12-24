import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handle recipe share API errors consistently.
 *
 * @param {Error | any} error - Error object
 * @param {string} operation - Operation name (GET, POST)
 * @returns {NextResponse} Error response
 */
export function handleRecipeShareError(error: Error | any, operation: string): NextResponse {
  logger.error(`[Recipe Share API] ${operation} error:`, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context: { endpoint: '/api/recipe-share', operation },
  });

  return NextResponse.json(
    ApiErrorHandler.createError('Something went wrong while sharing the recipe. Give it another go, chef.', 'SERVER_ERROR', 500),
    { status: 500 },
  );
}
