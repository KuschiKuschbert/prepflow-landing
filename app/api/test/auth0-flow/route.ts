import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Test NextAuth Authorization Flow
 * Simulates what happens when a user clicks "Sign in with Auth0"
 */
export async function GET(request: NextRequest) {
  try {
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/webapp';

    if (!nextAuthUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'NEXTAUTH_URL not set',
        },
        { status: 400 },
      );
    }

    // Construct the signin URL that NextAuth would generate
    const signinUrl = `${nextAuthUrl}/api/auth/signin/auth0?callbackUrl=${encodeURIComponent(callbackUrl)}`;

    // Test the actual signin endpoint
    const testResponse = await fetch(signinUrl, {
      method: 'GET',
      redirect: 'manual', // Don't follow redirects
      headers: {
        'User-Agent': 'PrepFlow-Auth0-Test/1.0',
      },
    });

    const location = testResponse.headers.get('location');
    const status = testResponse.status;

    // Parse the response
    const hasError = location?.includes('error=auth0');
    const redirectsToAuth0 = location?.includes('auth0.com') || location?.includes('dev-');

    logger.info('[Auth0 Flow Test] Signin endpoint test', {
      signinUrl,
      status,
      location,
      hasError,
      redirectsToAuth0,
    });

    return NextResponse.json({
      success: !hasError,
      test: {
        signinUrl,
        status,
        location,
        hasError,
        redirectsToAuth0,
        expectedBehavior: {
          shouldRedirectToAuth0: true,
          shouldNotHaveError: true,
        },
        actualBehavior: {
          redirectsToAuth0,
          hasError,
        },
        diagnosis: hasError
          ? 'NextAuth is returning error=auth0 before redirecting to Auth0. This indicates callback URL validation failure.'
          : redirectsToAuth0
            ? 'NextAuth is correctly redirecting to Auth0'
            : 'NextAuth is redirecting but not to Auth0',
      },
    });
  } catch (error) {
    logger.error('[Auth0 Flow Test] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
