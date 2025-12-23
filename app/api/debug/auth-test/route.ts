import { auth0 } from '@/lib/auth0';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Test endpoint to check Auth0 SDK configuration
 * This helps diagnose Auth0 SDK setup issues
 */
export async function GET(request: NextRequest) {
  try {
    const auth0BaseUrl = process.env.AUTH0_BASE_URL;
    const callbackUrl = auth0BaseUrl ? `${auth0BaseUrl}/api/auth/callback` : 'NOT SET';

    // Try to get the current session
    const session = await auth0.getSession(request);

    const testResults = {
      auth0BaseUrl: auth0BaseUrl || 'NOT SET',
      expectedCallbackUrl: callbackUrl,
      auth0Configured: Boolean(
        process.env.AUTH0_ISSUER_BASE_URL &&
        process.env.AUTH0_CLIENT_ID &&
        process.env.AUTH0_CLIENT_SECRET,
      ),
      sessionActive: Boolean(session?.user),
      userEmail: session?.user?.email || 'NOT FOUND',
    };

    // Log for debugging
    logger.info('[Auth Test] Auth0 SDK check:', {
      auth0Configured: testResults.auth0Configured,
      auth0BaseUrl: testResults.auth0BaseUrl,
      sessionActive: testResults.sessionActive,
    });

    return NextResponse.json(testResults, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    logger.error('[Auth Test] Error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError(
        error instanceof Error ? error.message : String(error),
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
