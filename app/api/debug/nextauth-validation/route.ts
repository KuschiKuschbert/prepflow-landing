import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Debug endpoint to investigate Auth0 SDK callback URL validation
 * This helps understand Auth0 SDK callback flow
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get('callbackUrl') || '/webapp';

    // Get environment variables
    const auth0BaseUrl = process.env.AUTH0_BASE_URL;
    const requestOrigin = request.headers.get('origin') || request.nextUrl.origin;
    const host = request.headers.get('host') || request.nextUrl.host;

    // Construct expected callback URL
    const expectedCallbackUrl = auth0BaseUrl
      ? `${auth0BaseUrl}/api/auth/callback`
      : `${requestOrigin}/api/auth/callback`;

    // Check what Auth0 SDK would construct
    const constructedCallbackUrl = auth0BaseUrl
      ? `${auth0BaseUrl}/api/auth/callback`
      : `${requestOrigin}/api/auth/callback`;

    // Log for debugging
    logger.info('[Auth0 SDK Validation Debug]', {
      auth0BaseUrl,
      requestOrigin,
      host,
      callbackUrl,
      expectedCallbackUrl,
      constructedCallbackUrl,
    });

    return NextResponse.json({
      environment: process.env.NODE_ENV,
      validation: {
        auth0BaseUrl,
        requestOrigin,
        host,
        callbackUrl,
        expectedCallbackUrl,
        constructedCallbackUrl,
        match: expectedCallbackUrl === constructedCallbackUrl,
      },
      analysis: {
        issue:
          auth0BaseUrl && requestOrigin !== auth0BaseUrl
            ? 'Request origin does not match AUTH0_BASE_URL - Auth0 SDK may validate against request origin'
            : 'Request origin matches AUTH0_BASE_URL',
        recommendation:
          auth0BaseUrl && requestOrigin !== auth0BaseUrl
            ? 'Ensure middleware redirects non-www to www BEFORE Auth0 SDK processes request'
            : 'Configuration appears correct',
      },
    });
  } catch (error) {
    logger.error('[Auth0 SDK Validation Debug] Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
