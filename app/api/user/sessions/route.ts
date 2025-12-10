import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

/**
 * GET /api/user/sessions
 * Get current user's active sessions
 * Note: NextAuth JWT sessions don't have a traditional session store,
 * so we return the current session information
 *
 * @returns {Promise<NextResponse>} Active sessions list
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    // NextAuth with JWT strategy doesn't maintain a session store
    // We return the current session as the only "active" session
    // In a production system with session storage, you would query the session store here
    return NextResponse.json({
      sessions: [
        {
          id: 'current',
          user_agent: 'Current Session',
          ip_address: null, // Not available in server-side context
          location: null,
          created_at: session.expires
            ? new Date(Date.now() - 3600000).toISOString()
            : new Date().toISOString(), // Approximate
          expires_at: session.expires,
          is_current: true,
        },
      ],
      note: 'NextAuth JWT sessions are stateless. Only the current session is shown.',
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



