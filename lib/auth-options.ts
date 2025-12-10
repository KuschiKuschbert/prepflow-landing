import type { NextAuthOptions } from 'next-auth';
import { syncUserFromAuth0 } from './auth-user-sync';
import { extractAuth0UserId, getUserRoles } from './auth0-management';
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
    providers.push(
      Auth0Provider({
        issuer: process.env.AUTH0_ISSUER_BASE_URL,
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        authorization: {
          params: {
            scope: 'openid profile email',
            ...(callbackUrl && { redirect_uri: callbackUrl }),
          },
        },
        ...(callbackUrl && { callbackURL: callbackUrl }),
      }),
    );
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
    maxAge: SESSION_MAX_AGE, // 4 hours - prevents "logged in forever" issue
  },
  providers,
  pages: {
    signIn: '/api/auth/signin', // Custom Cyber Carrot styled sign-in page
    error: '/api/auth/error', // Custom error page (optional)
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in - account and user are provided
      if (account && user) {
        // Auth0 best practice: Sync user to database on first login
        // Extract email and email_verified from Auth0 user object
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

        // Get roles from Auth0 - roles can be in id_token or from Management API
        // Auth0 typically includes roles in the id_token if configured
        // Safely access token properties - Auth0 tokens may have custom claims
        let roles: string[] = [];

        try {
          // Safely access account properties - account might not have expected structure
          // Ensure account is an object before accessing properties
          if (account && typeof account === 'object') {
            const accountAny = account as any;

            // Check various possible locations for roles
            // Auth0 roles can be in different places depending on configuration
            // Use optional chaining to safely access nested properties
            // Check if custom exists and is an object before accessing its properties
            let customRoles: string[] | undefined;
            if (
              accountAny?.custom &&
              typeof accountAny.custom === 'object' &&
              accountAny.custom !== null
            ) {
              customRoles = accountAny.custom.roles;
            }

            const userAny = user as any;

            // Check id_token for roles (Auth0 includes roles here if configured)
            const idToken = accountAny?.id_token;
            let idTokenRoles: string[] | undefined;
            if (idToken && typeof idToken === 'string') {
              try {
                // Decode JWT id_token to check for roles
                const parts = idToken.split('.');
                if (parts.length === 3) {
                  const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
                  idTokenRoles =
                    payload['https://prepflow.org/roles'] ||
                    payload.roles ||
                    payload['https://prepflow.org/custom']?.roles;
                }
              } catch {
                // Ignore id_token parsing errors
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
          // If there's any error accessing token properties, default to empty array
          // This prevents crashes if Auth0 token structure is unexpected
          roles = [];
          if (isDev) {
            logger.warn('[Auth0 JWT] Error extracting roles from token:', error);
          }
        }

        // If no roles found in token, try fetching from Management API
        let rolesSource = 'token';
        if (roles.length === 0) {
          try {
            // Extract Auth0 user ID from token sub claim
            const auth0UserId = extractAuth0UserId(token.sub || user?.id);
            if (auth0UserId) {
              if (isDev) {
                logger.dev(
                  '[Auth0 JWT] No roles in token, fetching from Management API for user:',
                  auth0UserId,
                );
              }
              const managementRoles = await getUserRoles(auth0UserId);
              if (managementRoles.length > 0) {
                roles = managementRoles;
                rolesSource = 'management-api';
                if (isDev) {
                  logger.dev('[Auth0 JWT] Roles fetched from Management API:', roles);
                }
              } else if (isDev) {
                logger.warn('[Auth0 JWT] No roles found in Management API for user:', auth0UserId);
              }
            } else if (isDev) {
              logger.warn('[Auth0 JWT] Could not extract Auth0 user ID from token sub:', token.sub);
            }
          } catch (error) {
            // If Management API fetch fails, log but don't crash
            if (isDev) {
              logger.error('[Auth0 JWT] Failed to fetch roles from Management API:', error);
            }
          }
        }

        // Store roles source in token for debugging
        // Add expiration timestamp (4 hours from now) to track token expiration
        const now = Math.floor(Date.now() / 1000);
        const tokenWithRoles = {
          ...token,
          roles: Array.isArray(roles) ? roles : [],
          accessToken: account?.access_token || null,
          rolesSource: rolesSource, // For debugging
          exp: now + SESSION_MAX_AGE, // Expiration timestamp (4 hours from now)
        };

        if (isDev) {
          logger.dev(`[Auth0 JWT] Final roles (source: ${rolesSource}):`, tokenWithRoles.roles);
          logger.dev(
            `[Auth0 JWT] Token expires at:`,
            new Date((tokenWithRoles.exp as number) * 1000).toISOString(),
          );
        }

        return tokenWithRoles;
      }

      // Token refresh - check expiration before returning token
      const now = Math.floor(Date.now() / 1000);
      const tokenExp = (token.exp as number) || 0;

      // If token expired, return error to force re-authentication
      if (tokenExp > 0 && tokenExp < now) {
        if (isDev) {
          logger.warn('[Auth0 JWT] Token expired, forcing re-authentication', {
            expiredAt: new Date(tokenExp * 1000).toISOString(),
            currentTime: new Date().toISOString(),
          });
        }
        return { ...token, error: 'RefreshAccessTokenError' };
      }

      // Token refresh - return existing token with roles preserved
      return token;
    },
    async session({ session, token }) {
      // If token has error (expired), return null session to force re-authentication
      if ((token as any).error === 'RefreshAccessTokenError') {
        if (isDev) {
          logger.warn('[Auth0 Session] Token expired, returning null session');
        }
        return null as any;
      }

      // Add roles to session
      if (session?.user) {
        (session.user as any).roles = Array.isArray(token.roles) ? token.roles : [];
        (session.user as any).role =
          Array.isArray(token.roles) && token.roles.length > 0 ? token.roles[0] : null;
      }
      return session;
    },
  },
};
