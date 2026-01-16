/**
 * GET /api/test/google-login-flow
 * Test endpoint to diagnose Google login flow issues.
 *
 * @returns {Promise<NextResponse>} JSON response with session status
 */
import { NextResponse, NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Test endpoint to check if Google login created a valid session.
 *
 * @returns {Promise<NextResponse>} JSON response with session status
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession(req);

    return NextResponse.json({
      success: true,
      session: session
        ? {
            user: {
              email: session.user?.email,
              name: session.user?.name,
              image: session.user?.picture,
              roles: (session.user as unknown)?.roles || [],
            },
            expiresAt: session.expiresAt,
          }
        : null,
      message: session
        ? 'Session exists - Google login successful'
        : 'No session found - Google login may have failed',
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    logger.error('[Google Login Flow Test] Error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to check session', 'SERVER_ERROR', 500, {
        details: error?.message || String(error),
      }),
      { status: 500 },
    );
  }
}
