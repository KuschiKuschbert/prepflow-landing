import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Diagnostic endpoint for Auth0 configuration
 * Helps diagnose production login issues without exposing secrets
 */
export async function GET(request: NextRequest) {
  // Allow access for debugging (temporary - can be secured later)
  // In production, this helps diagnose Auth0 issues
  // TODO: Add proper authentication/rate limiting for production use

  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const expectedCallbackUrl = nextAuthUrl
    ? `${nextAuthUrl}/api/auth/callback/auth0`
    : 'NOT SET';

  // Check if NEXTAUTH_URL is set correctly for production
  const isProduction = process.env.NODE_ENV === 'production';
  const isCorrectProductionUrl =
    isProduction && nextAuthUrl === 'https://www.prepflow.org';

  // Get request origin for comparison
  const requestOrigin = request.headers.get('origin') || request.nextUrl.origin;

  const diagnostics: {
    environment: string;
    nextAuthUrl: string;
    expectedCallbackUrl: string;
    requestOrigin: string;
    isCorrectProductionUrl: boolean;
    auth0Configured: boolean;
    nextAuthSecretSet: boolean;
    issues: string[];
    actualRedirectUri?: string;
    providerCallbackURL?: string;
    providerCheckError?: string;
  } = {
    environment: process.env.NODE_ENV,
    nextAuthUrl: nextAuthUrl || 'NOT SET',
    expectedCallbackUrl,
    requestOrigin,
    isCorrectProductionUrl,
    auth0Configured: Boolean(
      process.env.AUTH0_ISSUER_BASE_URL &&
        process.env.AUTH0_CLIENT_ID &&
        process.env.AUTH0_CLIENT_SECRET,
    ),
    nextAuthSecretSet: Boolean(process.env.NEXTAUTH_SECRET),
    issues: [],
  };

  // Check for common issues
  if (!nextAuthUrl) {
    diagnostics.issues.push('NEXTAUTH_URL is not set');
  } else if (isProduction && !isCorrectProductionUrl) {
    diagnostics.issues.push(
      `NEXTAUTH_URL is "${nextAuthUrl}" but should be "https://www.prepflow.org" for production`,
    );
  }

  if (nextAuthUrl && nextAuthUrl.endsWith('/')) {
    diagnostics.issues.push('NEXTAUTH_URL has trailing slash (should not)');
  }

  if (
    requestOrigin.includes('prepflow.org') &&
    !requestOrigin.includes('www.prepflow.org')
  ) {
    diagnostics.issues.push(
      'Request is from non-www domain - middleware should redirect to www',
    );
  }

  // Log diagnostics (safe - no secrets)
  // Check if we can get the actual authorization URL that NextAuth would generate
  try {
    const session = await getServerSession(authOptions);
    const auth0Provider = authOptions.providers.find(
      (p) => p.id === 'auth0',
    );

    if (auth0Provider && 'authorization' in auth0Provider) {
      const authParams = (auth0Provider as any).authorization?.params || {};
      diagnostics.actualRedirectUri = authParams.redirect_uri || 'NOT SET IN PROVIDER';
      diagnostics.providerCallbackURL = (auth0Provider as any).callbackURL || 'NOT SET IN PROVIDER';
    }
  } catch (error) {
    diagnostics.providerCheckError = error instanceof Error ? error.message : String(error);
  }

  logger.info('[Auth Debug] Configuration check:', {
    environment: diagnostics.environment,
    nextAuthUrlSet: Boolean(nextAuthUrl),
    isCorrectProductionUrl,
    requestOrigin,
    issuesCount: diagnostics.issues.length,
    actualRedirectUri: diagnostics.actualRedirectUri,
  });

  return NextResponse.json(diagnostics, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
