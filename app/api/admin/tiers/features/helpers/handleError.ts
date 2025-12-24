import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handle errors in admin tiers features API routes
 *
 * @param {unknown} error - Error object
 * @returns {NextResponse} Error response
 */
export function handleTiersFeaturesError(error: unknown): NextResponse {
  logger.error('[Admin Tiers Features] Unexpected error:', error);
  return NextResponse.json(
    ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
    { status: 500 },
  );
}
