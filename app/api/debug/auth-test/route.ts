import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Test endpoint to capture what NextAuth actually sends to Auth0
 * This helps diagnose the error=auth0 issue
 */
export async function GET(request: NextRequest) {
  try {
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const callbackUrl = nextAuthUrl
      ? `${nextAuthUrl}/api/auth/callback/auth0`
      : 'NOT SET';

    // Try to get the Auth0 provider and see its configuration
    const auth0Provider = authOptions.providers.find((p) => p.id === 'auth0');

    const testResults = {
      nextAuthUrl: nextAuthUrl || 'NOT SET',
      expectedCallbackUrl: callbackUrl,
      providerFound: Boolean(auth0Provider),
      providerId: auth0Provider?.id || 'NOT FOUND',
      // Try to access provider internals (may not work due to NextAuth internals)
      providerType: auth0Provider?.type || 'NOT FOUND',
    };

    // Log for debugging
    logger.info('[Auth Test] Provider check:', {
      providerFound: testResults.providerFound,
      nextAuthUrl: testResults.nextAuthUrl,
    });

    return NextResponse.json(testResults, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    logger.error('[Auth Test] Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
