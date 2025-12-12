import type { NextAuthOptions } from 'next-auth';
import { syncUserFromAuth0 } from './auth-user-sync';
import {
  extractAuth0UserId,
  getUserRoles,
  getUserProfileFromManagementAPI,
  fetchProfileWithRetry,
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

/**
 * Structured error context for authentication errors
 */
interface AuthErrorContext {
  errorCode: string;
  errorMessage: string;
  userId?: string;
  provider?: string;
  email?: string;
  hasAccount: boolean;
  hasUser: boolean;
  hasProfile: boolean;
  timestamp: string;
}

/**
 * Create structured error context for logging
 */
function createErrorContext(
  errorCode: string,
  errorMessage: string,
  context: {
    userId?: string;
    provider?: string;
    email?: string;
    hasAccount?: boolean;
    hasUser?: boolean;
    hasProfile?: boolean;
  } = {},
): AuthErrorContext {
  return {
    errorCode,
    errorMessage,
    userId: context.userId,
    provider: context.provider,
    email: context.email,
    hasAccount: context.hasAccount ?? false,
    hasUser: context.hasUser ?? false,
    hasProfile: context.hasProfile ?? false,
    timestamp: new Date().toISOString(),
  };
}

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
      // CRITICAL: Validate account and user exist
      if (!account || !user) {
        const errorContext = createErrorContext('MissingAccountOrUser', 'Account or user data missing', {
          userId: account?.providerAccountId,
          provider: account?.provider,
          hasAccount: !!account,
          hasUser: !!user,
        });
        logger.error('[Auth0 JWT] Missing account or user', errorContext);
        return { ...token, error: 'MissingAccountOrUser' };
      }

      // CRITICAL: Ensure email exists (required for authentication)
      let userEmail = (user as any)?.email || token.email || profile?.email;

      // If profile missing (Google login issue), try Management API with timeout and retry
      if (!profile && account.provider === 'auth0' && account.providerAccountId) {
        try {
          const fetchedEmail = await fetchProfileWithRetry(account.providerAccountId, userEmail);
          if (fetchedEmail) {
            userEmail = fetchedEmail;
            // Also try to get full profile for other fields
            const managementProfile = await getUserProfileFromManagementAPI(
              account.providerAccountId,
            );
            if (managementProfile) {
              Object.assign(user, {
                email: managementProfile.email || userEmail,
                email_verified: managementProfile.email_verified || false,
                name: managementProfile.name || (user as any)?.name,
                picture: managementProfile.picture || (user as any)?.picture,
              });
            }
          }
        } catch (error) {
          logger.warn('[Auth0 JWT] Failed to fetch profile from Management API:', {
            error: error instanceof Error ? error.message : String(error),
            providerAccountId: account.providerAccountId,
            fallbackEmail: userEmail,
          });
        }
      }

      // CRITICAL: If email still missing after all fallbacks, fail authentication
      if (!userEmail) {
        const errorContext = createErrorContext(
          'MissingEmail',
          'Email missing after all fallbacks (profile, token, Management API)',
          {
            userId: account.providerAccountId,
            provider: account.provider,
            hasAccount: true,
            hasUser: true,
            hasProfile: !!profile,
          },
        );
        logger.error('[Auth0 JWT] Email missing after all fallbacks', errorContext);
        return { ...token, error: 'MissingEmail' };
      }

      const emailVerified = (user as any)?.email_verified || (profile as any)?.email_verified || false;

      // Sync user asynchronously (don't block authentication)
      // userEmail is guaranteed to exist at this point (validated above)
      syncUserFromAuth0(userEmail, emailVerified).catch(err => {
        logger.error('[Auth0 JWT] Failed to sync user:', {
          error: err instanceof Error ? err.message : String(err),
          email: userEmail,
        });
      });

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
        logger.warn('[Auth0 JWT] Error extracting roles from token:', {
          error: error instanceof Error ? error.message : String(error),
          providerAccountId: account?.providerAccountId,
        });
      }

      let rolesSource = 'token';
      if (roles.length === 0) {
        try {
          const auth0UserId = extractAuth0UserId(
            token.sub || (user as any)?.id || account.providerAccountId,
          );
          if (auth0UserId) {
            const managementRoles = await getUserRoles(auth0UserId);
            if (managementRoles.length > 0) {
              roles = managementRoles;
              rolesSource = 'management-api';
            }
          }
        } catch (error) {
          logger.warn('[Auth0 JWT] Failed to fetch roles from Management API:', {
            error: error instanceof Error ? error.message : String(error),
            providerAccountId: account.providerAccountId,
          });
        }
      }

      const tokenNow = Math.floor(Date.now() / 1000);
      return {
        ...token,
        email: userEmail, // Ensure email is always in token
        name: (user as any)?.name || (profile as any)?.name || token.name,
        picture: (user as any)?.picture || (profile as any)?.picture || token.picture,
        sub: token.sub || account.providerAccountId || (user as any)?.id,
        roles: Array.isArray(roles) ? roles : [],
        accessToken: account?.access_token || null,
        rolesSource,
        exp: tokenNow + SESSION_MAX_AGE,
      };
      // Token refresh logic (when account/user not present)
      const refreshNow = Math.floor(Date.now() / 1000);
      const tokenExp = (token.exp as number) || 0;
      if (tokenExp > 0 && tokenExp < refreshNow) {
        return { ...token, error: 'RefreshAccessTokenError' };
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      // CRITICAL: Validate user has email (required for authentication)
      const userEmail = (user as any)?.email || profile?.email;

      if (!userEmail) {
        const errorContext = createErrorContext(
          'MissingEmail',
          'Email missing from user and profile in signIn callback',
          {
            userId: account?.providerAccountId,
            provider: account?.provider,
            hasAccount: !!account,
            hasUser: !!user,
            hasProfile: !!profile,
          },
        );
        logger.error('[Auth0 SignIn] Email missing from user and profile', errorContext);

        // Try Management API as last resort before denying
        if (account?.providerAccountId && account.provider === 'auth0') {
          try {
            const managementProfile = await getUserProfileFromManagementAPI(
              account.providerAccountId,
            );
            if (managementProfile?.email) {
              logger.info('[Auth0 SignIn] Email found via Management API fallback', {
                email: managementProfile.email,
                providerAccountId: account.providerAccountId,
              });
              return true; // Allow sign-in
            }
          } catch (error) {
            logger.error('[Auth0 SignIn] Management API fallback failed:', {
              error: error instanceof Error ? error.message : String(error),
              providerAccountId: account.providerAccountId,
            });
          }
        }

        // Deny sign-in - email is critical
        return false;
      }

      // Log successful sign-in attempt
      logger.info('[Auth0 SignIn] Sign-in allowed', {
        email: userEmail,
        provider: account?.provider,
        hasProfile: !!profile,
        hasAccount: !!account,
        providerAccountId: account?.providerAccountId,
      });

      return true;
    },
    async session({ session, token }) {
      // CRITICAL: Validate token exists
      if (!token) {
        const errorContext = createErrorContext(
          'MissingToken',
          'Token is null/undefined in session callback',
          {
            email: session?.user?.email || undefined,
          },
        );
        logger.error('[Auth0 Session] Token is null/undefined', errorContext);
        return null as any; // Force re-authentication
      }

      // Validate token.exp is a number before checking expiration
      if ((token as any).error === 'RefreshAccessTokenError') {
        logger.warn('[Auth0 Session] Token expired, returning null session');
        return null as any; // Expired token - force re-authentication
      }

      // Check for other token errors (MissingEmail, MissingAccountOrUser)
      if ((token as any).error) {
        logger.error('[Auth0 Session] Token has error:', {
          error: (token as any).error,
          email: token.email,
          sub: token.sub,
        });
        return null as any; // Force re-authentication for critical errors
      }

      // CRITICAL: Ensure email exists (required for middleware/allowlist)
      const email = token.email || (token.sub ? token.sub.split('|')[1] : undefined);
      if (!email && !session?.user?.email) {
        const errorContext = createErrorContext(
          'MissingEmail',
          'Email missing from token and session in session callback',
          {
            userId: token.sub,
            email: token.email || undefined,
          },
        );
        logger.error('[Auth0 Session] Email missing from token and session', errorContext);
        return null as any; // Force re-authentication
      }

      // CRITICAL: Ensure session is always returned (never null/undefined)
      if (!session) {
        logger.error('[Auth0 Session] Session is null/undefined, creating fallback session');
        return {
          user: {
            email: email || token.email || undefined,
            name: token.name || undefined,
            image: token.picture || undefined,
          },
          expires: new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString(),
        } as any;
      }

      // Ensure session.user exists
      if (!session.user) {
        session.user = {
          email: email || token.email || undefined,
          name: token.name || undefined,
          image: token.picture || undefined,
        };
      } else {
        // Ensure email is set in session.user
        if (!session.user.email) {
          session.user.email = email || token.email || undefined;
        }
      }

      // Add roles to session
      if (session.user) {
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
    async redirect({ url, baseUrl }) {
      // Validate callbackUrl is safe (same origin)
      if (url.startsWith('/')) {
        // Relative URL - safe
        logger.dev('[Auth0 Redirect] Redirecting to relative URL:', url);
        return url;
      }
      if (url.startsWith(baseUrl)) {
        // Same origin - safe
        logger.dev('[Auth0 Redirect] Redirecting to same-origin URL:', url);
        return url;
      }
      // External URL or invalid - use fallback
      logger.warn('[Auth0 Redirect] Invalid callbackUrl, using fallback', {
        url,
        baseUrl,
        fallback: `${baseUrl}/webapp`,
      });
      return `${baseUrl}/webapp`;
    },
  },
};
