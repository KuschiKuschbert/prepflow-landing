/**
 * GET /api/test/google-login-flow
 * Test endpoint to diagnose Google login flow issues.
 *
 * @returns {Promise<NextResponse>} JSON response with session status
 */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';

/**
 * Test endpoint to check if Google login created a valid session.
 *
 * @returns {Promise<NextResponse>} JSON response with session status
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    return NextResponse.json({
      success: true,
      session: session
        ? {
            user: {
              email: session.user?.email,
              name: session.user?.name,
              image: session.user?.image,
              roles: (session.user as any)?.roles || [],
            },
            expires: session.expires,
          }
        : null,
      message: session
        ? 'Session exists - Google login successful'
        : 'No session found - Google login may have failed',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error('[Google Login Flow Test] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to check session',
      },
      { status: 500 },
    );
  }
}
