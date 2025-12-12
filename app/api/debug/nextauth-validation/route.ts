import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';

/**
 * Debug endpoint to investigate NextAuth callback URL validation
 * This helps understand when and why NextAuth adds error=auth0
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get('callbackUrl') || '/webapp';
    const providerId = searchParams.get('provider') || 'auth0';

    // Get environment variables
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const requestOrigin = request.headers.get('origin') || request.nextUrl.origin;
    const host = request.headers.get('host') || request.nextUrl.host;

    // Construct expected callback URL
    const expectedCallbackUrl = nextAuthUrl
      ? `${nextAuthUrl}/api/auth/callback/${providerId}`
      : `${requestOrigin}/api/auth/callback/${providerId}`;

    // Get provider configuration
    const providers = authOptions.providers || [];
    const auth0Provider = providers.find((p: any) => p.id === providerId);

    // Extract provider configuration details
    let providerConfig: any = {};
    if (auth0Provider) {
      try {
        // Try to access provider internals (may not be accessible)
        providerConfig = {
          id: auth0Provider.id,
          name: auth0Provider.name,
          type: (auth0Provider as any).type,
          // Try to get callback URL from provider
          callbackURL: (auth0Provider as any).callbackURL,
          // Try to get authorization params
          authorizationParams: (auth0Provider as any).authorization?.params,
        };
      } catch (e) {
        // Provider internals may not be accessible
        providerConfig = { error: 'Cannot access provider internals' };
      }
    }

    // Check what NextAuth would construct
    const constructedCallbackUrl = nextAuthUrl
      ? `${nextAuthUrl}/api/auth/callback/${providerId}`
      : `${requestOrigin}/api/auth/callback/${providerId}`;

    // Log for debugging
    logger.info('[NextAuth Validation Debug]', {
      nextAuthUrl,
      requestOrigin,
      host,
      callbackUrl,
      providerId,
      expectedCallbackUrl,
      constructedCallbackUrl,
      providerFound: !!auth0Provider,
      providerConfig,
    });

    return NextResponse.json({
      environment: process.env.NODE_ENV,
      validation: {
        nextAuthUrl,
        requestOrigin,
        host,
        callbackUrl,
        providerId,
        expectedCallbackUrl,
        constructedCallbackUrl,
        match: expectedCallbackUrl === constructedCallbackUrl,
      },
      provider: {
        found: !!auth0Provider,
        config: providerConfig,
        totalProviders: providers.length,
      },
      analysis: {
        issue:
          nextAuthUrl && requestOrigin !== nextAuthUrl
            ? 'Request origin does not match NEXTAUTH_URL - NextAuth may validate against request origin'
            : 'Request origin matches NEXTAUTH_URL',
        recommendation:
          nextAuthUrl && requestOrigin !== nextAuthUrl
            ? 'Ensure middleware redirects non-www to www BEFORE NextAuth processes request'
            : 'Configuration appears correct - error may be from NextAuth internal validation',
      },
    });
  } catch (error) {
    logger.error('[NextAuth Validation Debug] Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
