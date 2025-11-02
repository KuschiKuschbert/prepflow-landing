import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

/**
 * Custom logout endpoint that handles Auth0 session clearing
 *
 * IMPORTANT: Auth0 Developer Keys Limitations
 * - Federated logout (?federated) will NOT work with developer keys + social connections
 * - Basic logout (/v2/logout) should still work, but returnTo URL must be whitelisted
 * - For production, use your own Client ID/Secret from social providers
 *
 * See: https://auth0.com/docs/authenticate/identity-providers/social-identity-providers/developer-keys
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

  // Check if we're likely using developer keys (this is a heuristic check)
  // Developer keys typically have Auth0's generic client IDs, but we can't detect this reliably
  // Instead, we'll log a warning and provide guidance
  const isDevelopment = process.env.NODE_ENV === 'development';

  // If Auth0 configuration is available, redirect to Auth0 logout endpoint
  if (auth0Issuer && clientId) {
    try {
      // Construct Auth0 logout URL
      // Note: We're NOT using ?federated because:
      // 1. It doesn't work with developer keys + social connections
      // 2. Basic logout should be sufficient for clearing Auth0 session
      //
      // The returnTo URL MUST be whitelisted in Auth0 dashboard under:
      // Applications > Settings > Allowed Logout URLs
      const logoutUrl = `${auth0Issuer}/v2/logout?client_id=${encodeURIComponent(clientId)}&returnTo=${encodeURIComponent(returnTo)}`;

      // Validate URL construction
      new URL(logoutUrl); // Will throw if invalid

      // Log logout attempt for debugging (only in development)
      if (isDevelopment) {
        console.log('[Auth0 Logout] Redirecting to:', logoutUrl);
        console.log('[Auth0 Logout] ReturnTo URL:', returnTo);
        console.log(
          '[Auth0 Logout] Make sure this URL is whitelisted in Auth0 dashboard under "Allowed Logout URLs"',
        );
      }

      // Redirect to Auth0 logout endpoint
      // Auth0 will:
      // 1. Clear Auth0 session cookies
      // 2. Clear any social provider sessions (if using federated, but that won't work with dev keys)
      // 3. Redirect back to returnTo URL
      return NextResponse.redirect(logoutUrl);
    } catch (error) {
      // If Auth0 logout URL construction fails, log error and redirect to landing
      console.error('[Auth0 Logout] Error constructing logout URL:', error);

      // Fallback: redirect to landing page anyway
      // The NextAuth session should already be cleared on the client side
      return NextResponse.redirect(new URL(returnTo, request.url));
    }
  } else {
    // Log missing configuration for debugging
    console.warn('[Auth0 Logout] Missing AUTH0_ISSUER_BASE_URL or AUTH0_CLIENT_ID');
    console.warn('[Auth0 Logout] Only NextAuth session will be cleared (client-side)');

    // Fallback: redirect to landing page
    // This ensures logout still works even if Auth0 config is missing
    return NextResponse.redirect(new URL(returnTo, request.url));
  }
}
