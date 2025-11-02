import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

/**
 * Custom logout endpoint that handles Auth0 session clearing
 * This route clears NextAuth session and redirects to Auth0 logout endpoint
 */
export async function GET(request: NextRequest) {
  // Get Auth0 configuration from environment
  const auth0Issuer = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;

  // Get the returnTo URL from query params, default to landing page
  const returnToParam = request.nextUrl.searchParams.get('returnTo');
  let returnTo = returnToParam || '/';

  // Ensure returnTo is an absolute URL for Auth0
  if (!returnTo.startsWith('http://') && !returnTo.startsWith('https://')) {
    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;
    returnTo = new URL(returnTo, baseUrl).toString();
  }

  // If Auth0 configuration is available, redirect to Auth0 logout endpoint
  if (auth0Issuer && clientId) {
    try {
      // Construct Auth0 logout URL
      // Auth0 will clear its session and redirect back to returnTo
      // Note: returnTo must be whitelisted in Auth0 dashboard under "Allowed Logout URLs"
      const logoutUrl = `${auth0Issuer}/v2/logout?client_id=${encodeURIComponent(clientId)}&returnTo=${encodeURIComponent(returnTo)}`;

      // Validate URL construction
      new URL(logoutUrl); // Will throw if invalid

      // Clear NextAuth session by redirecting to signOut, then to Auth0
      // We'll handle NextAuth session clearing via the redirect
      return NextResponse.redirect(logoutUrl);
    } catch (error) {
      // If Auth0 logout URL construction fails, log error and redirect to landing
      console.error('Error constructing Auth0 logout URL:', error);
      return NextResponse.redirect(new URL(returnTo, request.url));
    }
  } else {
    // Log missing configuration for debugging
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'Auth0 logout: Missing AUTH0_ISSUER_BASE_URL or AUTH0_CLIENT_ID. Redirecting to landing page.',
      );
    }
    // Fallback: redirect to landing page
    return NextResponse.redirect(new URL(returnTo, request.url));
  }
}
