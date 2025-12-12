import type { NextAuthOptions } from 'next-auth';
import { syncUserFromAuth0 } from './auth-user-sync';
import {
  extractAuth0UserId,
  getUserRoles,
  getUserProfileFromManagementAPI,
} from './auth0-management';
import { logger } from './logger';

const isDev = process.env.NODE_ENV === 'development';

// Conditionally create providers array - only include Auth0 if env vars are configured
// This prevents openid-client from being evaluated when Auth0 is not configured
const providers: NextAuthOptions['providers'] = [];

if (
  process.env.AUTH0_ISSUER_BASE_URL &&
  process.env.AUTH0_CLIENT_ID &&
  process.env.AUTH0_CLIENT_SECRET
) {
  // Only import Auth0Provider when env vars are present
  // Using dynamic import() would be ideal but NextAuth expects synchronous provider array
  // So we use a try-catch to handle edge runtime compatibility issues
  try {
    const Auth0Provider = require('next-auth/providers/auth0').default;
    // Force callback URL to always use NEXTAUTH_URL (fixes domain mismatch issues)
    const callbackUrl = process.env.NEXTAUTH_URL
      ? `${process.env.NEXTAUTH_URL}/api/auth/callback/auth0`
      : undefined;

    // Logging to verify callback URL construction (dev + production for debugging)
    if (callbackUrl) {
      if (isDev) {
        logger.dev('[Auth0 Config] Forced callback URL:', callbackUrl);
        logger.dev('[Auth0 Config] NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
      } else {
        // Production logging (safe - no secrets, just URLs)
        logger.info('[Auth0 Config] Callback URL configured:', {
          callbackUrl,
          nextAuthUrl: process.env.NEXTAUTH_URL,
        });
      }
    } else {
      logger.error('[Auth0 Config] NEXTAUTH_URL not set - callback URL cannot be constructed');
    }

    // CRITICAL: Force callback URL to prevent domain mismatch errors
    // NextAuth may construct callback URLs from request origin, so we explicitly override
    const providerConfig: any = {
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
    };

    // Force callback URL in both places to ensure NextAuth uses it
    if (callbackUrl) {
      // Set redirect_uri in authorization params (what Auth0 sees)
      providerConfig.authorization.params.redirect_uri = callbackUrl;
      // Set callbackURL at provider level (what NextAuth uses internally)
      providerConfig.callbackURL = callbackUrl;

      // Log the forced callback URL for debugging
      if (isDev) {
        logger.dev('[Auth0 Config] Forcing callback URL:', callbackUrl);
      } else {
        logger.info('[Auth0 Config] Forcing callback URL:', { callbackUrl });
      }
    } else {
      logger.error('[Auth0 Config] Cannot force callback URL - NEXTAUTH_URL not set');
    }

    providers.push(Auth0Provider(providerConfig));
  } catch (error) {
    // If Auth0 provider fails to load (e.g., edge runtime issues), continue without it
    // This allows the app to work in development without Auth0 configured
    logger.warn(
      'Auth0 provider not available:',
      error instanceof Error ? error.message : String(error),
    );
  }
}

// Session duration configuration (4 hours default, matches client-side timeout)
const SESSION_MAX_AGE = Number(process.env.NEXTAUTH_SESSION_MAX_AGE) || 4 * 60 * 60; // 4 hours in seconds

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE,
  },
  providers,
  pages: {
    error: '/api/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        // If profile missing (Google login issue), fetch from Management API
        if (!profile && account.provider === 'auth0' && account.providerAccountId) {
          try {
            const managementProfile = await getUserProfileFromManagementAPI(
              account.providerAccountId,
            );
            if (managementProfile) {
              Object.assign(user, {
                email: managementProfile.email || (user as any)?.email,
                email_verified: managementProfile.email_verified || false,
                name: managementProfile.name || (user as any)?.name,
                picture: managementProfile.picture || (user as any)?.picture,
              });
            }
          } catch (error) {
            if (isDev) {
              logger.warn('[Auth0 JWT] Failed to fetch profile from Management API:', error);
            }
          }
        }
        const userEmail = (user as any)?.email || token.email;
        const emailVerified = (user as any)?.email_verified || false;

        if (userEmail) {
          // Sync user asynchronously (don't block authentication)
          syncUserFromAuth0(userEmail, emailVerified).catch(err => {
            logger.error('[Auth0 JWT] Failed to sync user:', {
              error: err instanceof Error ? err.message : String(err),
              email: userEmail,
            });
          });
        }

        let roles: string[] = [];
        try {
          if (account && typeof account === 'object') {
            const accountAny = account as any;
            let customRoles: string[] | undefined;
            if (
              accountAny?.custom &&
              typeof accountAny.custom === 'object' &&
              accountAny.custom !== null
            ) {
              customRoles = accountAny.custom.roles;
            }
            const userAny = user as any;
            const idToken = accountAny?.id_token;
            let idTokenRoles: string[] | undefined;
            if (idToken && typeof idToken === 'string') {
              try {
                const parts = idToken.split('.');
                if (parts.length === 3) {
                  const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
                  idTokenRoles =
                    payload['https://prepflow.org/roles'] ||
                    payload.roles ||
                    payload['https://prepflow.org/custom']?.roles;
                }
              } catch {
                // Ignore parsing errors
              }
            }

            roles =
              accountAny?.roles ||
              customRoles ||
              idTokenRoles ||
              userAny?.roles ||
              userAny?.['https://prepflow.org/roles'] ||
              userAny?.['https://prepflow.org/custom']?.roles ||
              [];

            if (isDev && roles.length > 0) {
              logger.dev('[Auth0 JWT] Roles found in token:', roles);
            }
          }
        } catch (error) {
          roles = [];
          if (isDev) {
            logger.warn('[Auth0 JWT] Error extracting roles from token:', error);
          }
        }
        let rolesSource = 'token';
        if (roles.length === 0) {
          try {
            const auth0UserId = extractAuth0UserId(token.sub || user?.id);
            if (auth0UserId) {
              const managementRoles = await getUserRoles(auth0UserId);
              if (managementRoles.length > 0) {
                roles = managementRoles;
                rolesSource = 'management-api';
              }
            }
          } catch (error) {
            if (isDev) {
              logger.error('[Auth0 JWT] Failed to fetch roles from Management API:', error);
            }
          }
        }
        const now = Math.floor(Date.now() / 1000);
        return {
          ...token,
          roles: Array.isArray(roles) ? roles : [],
          accessToken: account?.access_token || null,
          rolesSource,
          exp: now + SESSION_MAX_AGE,
        };
      }
      const now = Math.floor(Date.now() / 1000);
      const tokenExp = (token.exp as number) || 0;
      if (tokenExp > 0 && tokenExp < now) {
        return { ...token, error: 'RefreshAccessTokenError' };
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      if (isDev) {
        logger.dev('[Auth0 SignIn] Signin attempt:', {
          provider: account?.provider,
          providerAccountId: account?.providerAccountId,
          userEmail: (user as any)?.email,
          hasProfile: !!profile,
          hasAccount: !!account,
        });
      }
      return true;
    },
    async session({ session, token }) {
      // If token has error (expired), return null session to force re-authentication
      if ((token as any).error === 'RefreshAccessTokenError') {
        if (isDev) {
          logger.warn('[Auth0 Session] Token expired, returning null session');
        }
        return null as any;
      }

      // CRITICAL: Ensure session is always returned (never null/undefined)
      if (!session) {
        logger.error('[Auth0 Session] Session is null/undefined');
        return {
          user: {
            email: token.email || null,
            name: token.name || null,
            image: token.picture || null,
          },
          expires: new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString(),
        } as any;
      }

      // Add roles to session
      if (session?.user) {
        (session.user as any).roles = Array.isArray(token.roles) ? token.roles : [];
        (session.user as any).role =
          Array.isArray(token.roles) && token.roles.length > 0 ? token.roles[0] : null;
      }

      // Ensure session always has required fields
      if (!session.expires) {
        session.expires = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString();
      }
      return session;
    },
  },
};
