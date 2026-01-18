import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/user/sessions
 * Get current user's active sessions
 * Note: Auth0 SDK sessions are stateless (JWT-based),
 * so we return the current session information
 *
 * @returns {Promise<NextResponse>} Active sessions list
 */
export async function GET(req: NextRequest) {
  try {
    const _user = await requireAuth(req);
    const session = await auth0.getSession(req);

    // Auth0 SDK with JWT strategy doesn't maintain a session store
    // We return the current session as the only "active" session
    // In a production system with session storage, you would query the session store here
    return NextResponse.json({
      sessions: [
        {
          id: 'current',
          user_agent: 'Current Session',
          ip_address: null, // Not available in server-side context
          location: null,
          created_at: session?.expiresAt
            ? new Date(Date.now() - 3600000).toISOString()
            : new Date().toISOString(), // Approximate
          expires_at: session?.expiresAt || null,
          is_current: true,
        },
      ],
      note: 'Auth0 SDK JWT sessions are stateless. Only the current session is shown.',
    });
  } catch (error) {
    logger.error('[Sessions API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/sessions', method: 'GET' },
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
