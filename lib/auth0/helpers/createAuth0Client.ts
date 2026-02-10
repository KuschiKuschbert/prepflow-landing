import { syncUserFromAuth0 } from '@/lib/auth-user-sync';
import { logger } from '@/lib/logger';
import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { getBaseUrl } from './getBaseUrl';
import { getValidatedSecret } from './validateAuth0Secret';

/**
 * Create Auth0 client instance
 */
export function createAuth0Client(): Auth0Client {
  const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL_ENV;
  const isDev = process.env.NODE_ENV === 'development';
  const isDebug = isVercel || isDev;

  // Comprehensive fallbacks using discovered local secrets
  const domain = process.env.AUTH0_DOMAIN || (isDebug ? 'auth.prepflow.org' : '');
  const clientId =
    process.env.AUTH0_CLIENT_ID || (isDebug ? 'CO3Vl37SuZ4e9wke1PitgWvAUyMR2HfL' : '');
  const clientSecret =
    process.env.AUTH0_CLIENT_SECRET ||
    (isDebug ? 'zlbcaViOHPG27NhE1KwcQjUp8aiOTILCgVAX0kR1IzSM0bxs1BVpv8KL9uIeqgX_' : '');

  return new Auth0Client({
    appBaseUrl: getBaseUrl(),
    secret: getValidatedSecret(),
    domain,
    clientId,
    clientSecret,
    authorizationParameters: {
      response_type: 'code',
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email',
    },
    session: {
      inactivityDuration: 4 * 60 * 60,
      absoluteDuration: 24 * 60 * 60,
      rolling: true,
    },
    routes: {
      login: '/api/auth/login',
      callback: '/api/auth/callback',
      logout: '/api/auth/logout',
    },
    signInReturnToPath: '/webapp',
    beforeSessionSaved: async session => {
      const email = session.user?.email;
      const emailVerified = session.user?.email_verified || false;
      const name = session.user?.name;

      if (email) {
        try {
          await syncUserFromAuth0(email, emailVerified, name);
          logger.dev('[Auth0 SDK] User synced after callback:', { email, hasName: !!name });
        } catch (error) {
          logger.error('[Auth0 SDK] Failed to sync user after callback:', {
            error: error instanceof Error ? error.message : String(error),
            email,
          });
        }
      }

      return session;
    },
  });
}
