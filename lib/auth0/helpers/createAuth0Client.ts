import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { syncUserFromAuth0 } from '@/lib/auth-user-sync';
import { logger } from '@/lib/logger';
import { getBaseUrl } from './getBaseUrl';
import { getAuth0Domain } from './getAuth0Domain';
import { getValidatedSecret } from './validateAuth0Secret';

/**
 * Create Auth0 client instance
 */
export function createAuth0Client(): Auth0Client {
  return new Auth0Client({
    appBaseUrl: getBaseUrl(),
    secret: getValidatedSecret(),
    domain: getAuth0Domain(),
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
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

