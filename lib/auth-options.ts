import type { NextAuthOptions } from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    Auth0Provider({
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    signOut: async ({ url, baseUrl }) => {
      // Get Auth0 configuration from environment
      const auth0Issuer = process.env.AUTH0_ISSUER_BASE_URL;
      const clientId = process.env.AUTH0_CLIENT_ID;

      // Determine the returnTo URL - prefer callbackUrl from query params, fallback to baseUrl or landing
      let returnTo = '/'; // Default to landing page

      try {
        if (url) {
          // Handle both absolute URLs and relative paths
          let urlObj: URL;
          if (url.startsWith('http://') || url.startsWith('https://')) {
            urlObj = new URL(url);
          } else {
            // Relative URL, construct absolute URL using baseUrl
            urlObj = new URL(url, baseUrl || process.env.NEXTAUTH_URL || 'http://localhost:3000');
          }

          const callbackUrl = urlObj.searchParams.get('callbackUrl');
          if (callbackUrl) {
            returnTo = callbackUrl;
          }
        }
      } catch (error) {
        // If URL parsing fails, use fallback values
        console.error('Error parsing logout URL:', error);
      }

      // Fallback chain: callbackUrl > baseUrl > NEXTAUTH_URL > landing page
      if (!returnTo || returnTo === '/') {
        returnTo = baseUrl || process.env.NEXTAUTH_URL || '/';
      }

      // Ensure returnTo is an absolute URL for Auth0
      if (!returnTo.startsWith('http://') && !returnTo.startsWith('https://')) {
        const base = baseUrl || process.env.NEXTAUTH_URL || 'http://localhost:3000';
        returnTo = new URL(returnTo, base).toString();
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

          return logoutUrl;
        } catch (error) {
          // If Auth0 logout URL construction fails, log error but still allow logout
          console.error('Error constructing Auth0 logout URL:', error);
          // Fall through to return returnTo directly (NextAuth session still cleared)
        }
      } else {
        // Log missing configuration for debugging
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            'Auth0 logout: Missing AUTH0_ISSUER_BASE_URL or AUTH0_CLIENT_ID. Only clearing NextAuth session.',
          );
        }
      }

      // Fallback: return the base URL or landing page
      // This ensures logout still works even if Auth0 logout endpoint fails
      return returnTo;
    },
  },
};
