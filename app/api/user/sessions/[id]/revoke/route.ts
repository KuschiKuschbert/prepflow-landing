import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/user/sessions/[id]/revoke
 * Revoke a user session
 * Note: With NextAuth JWT strategy, we can't revoke individual sessions
 * This endpoint is provided for API compatibility but logs out the current session
 *
 * @param {NextRequest} req - Request object
 * @param {Object} context - Route context with params
 * @param {Promise<{ id: string }>} context.params - Route parameters
 * @returns {Promise<NextResponse>} Revocation response
 */
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(req);
    const { id } = await context.params;

    // With Auth0 SDK JWT strategy, we can't revoke individual sessions
    // If the requested session is the current one, we can sign them out
    if (id === 'current') {
      // Return sign-out URL
      return NextResponse.json({
        success: true,
        message: 'Session revoked. Please sign out to complete.',
        sign_out_url: '/api/auth/logout',
        note: 'With JWT sessions, you must sign out to revoke the current session.',
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Session not found or cannot be revoked',
      note: 'Auth0 SDK JWT sessions are stateless. Only the current session can be revoked by signing out.',
    });
  } catch (error) {
    logger.error('[Sessions API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/sessions/[id]/revoke', method: 'POST' },
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
