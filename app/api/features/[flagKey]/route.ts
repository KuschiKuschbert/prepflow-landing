import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/features/[flagKey]
 * Check if a feature flag is enabled for the current user.
 *
 * @param {NextRequest} req - Request object
 * @param {Object} context - Route context
 * @param {Promise<{flagKey: string}>} context.params - Route parameters
 * @returns {Promise<NextResponse>} JSON response with enabled status
 */
export async function GET(req: NextRequest, context: { params: Promise<{ flagKey: string }> }) {
  try {
    const { flagKey } = await context.params;
    const user = await requireAuth(req);

    // Get user info from session
    const userId = user.sub;
    const userEmail = user.email || undefined;

    // Check feature flag
    const enabled = await isFeatureEnabled(flagKey, userId, userEmail);

    return NextResponse.json({ enabled });
  } catch (error) {
    logger.error('[API /features/[flagKey]] Failed to check feature flag:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/features/[flagKey]', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
