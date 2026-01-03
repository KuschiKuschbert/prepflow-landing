import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handle AI specials API errors consistently.
 *
 * @param {Error | any} error - Error object
 * @param {string} operation - Operation name (GET, POST)
 * @param {Object} [context] - Optional context (requestId, userId, url)
 * @returns {NextResponse} Error response
 */
export function handleAISpecialsError(
  error: Error | any,
  operation: string,
  context?: { requestId?: string; userId?: string; url?: string },
): NextResponse {
  logger.error(`[AI Specials API] ${operation} error:`, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    errorType: error?.constructor?.name,
    isNextResponse: error instanceof NextResponse,
    context: {
      endpoint: '/api/ai-specials',
      operation,
      ...context,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });

  // Include requestId in all error responses for correlation
  const errorResponse: {
    error: string;
    message: string;
    requestId?: string;
    code?: string;
  } = {
    error: 'Internal server error',
    message: 'Something went wrong while processing your request. Give it another go, chef.',
  };

  if (context?.requestId) {
    errorResponse.requestId = context.requestId;
  }

  // Add error code if available
  if (error && typeof error === 'object' && 'code' in error) {
    errorResponse.code = String(error.code);
  }

  return NextResponse.json(errorResponse, { status: 500 });
}
