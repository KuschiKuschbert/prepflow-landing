/**
 * Auth0 SDK Client Instance
 * Auth0 SDK v4 uses a singleton client instance
 */

import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { syncUserFromAuth0 } from './auth-user-sync';
import { logger } from './logger';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Dynamic base URL detection for Auth0 SDK
 * Supports dev, preview (Vercel), and production environments
 */
function getBaseUrl(): string {
  // Preview deployments: Use VERCEL_URL (auto-detected by Vercel)
  if (process.env.VERCEL_URL) {
    const protocol = process.env.VERCEL_URL.startsWith('localhost') ? 'http' : 'https';
    return `${protocol}://${process.env.VERCEL_URL}`;
  }

  // Explicit base URL (production or custom)
  if (process.env.AUTH0_BASE_URL) {
    return process.env.AUTH0_BASE_URL;
  }

  // Development default
  return 'http://localhost:3000';
}

/**
 * Create Auth0 client instance
 * Reads configuration from environment variables automatically:
 * - AUTH0_SECRET
 * - AUTH0_BASE_URL (or auto-detects from VERCEL_URL)
 * - AUTH0_ISSUER_BASE_URL
 * - AUTH0_CLIENT_ID
 * - AUTH0_CLIENT_SECRET
 */
// Extract domain from AUTH0_ISSUER_BASE_URL or use AUTH0_DOMAIN
function getAuth0Domain(): string | undefined {
  // Prefer AUTH0_DOMAIN if set (Auth0 SDK standard)
  if (process.env.AUTH0_DOMAIN) {
    return process.env.AUTH0_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  // Fallback to extracting from AUTH0_ISSUER_BASE_URL
  if (process.env.AUTH0_ISSUER_BASE_URL) {
    return process.env.AUTH0_ISSUER_BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  return undefined;
}

/**
 * Validate and get AUTH0_SECRET
 * Throws error if secret is missing or invalid (fail fast)
 */
function validateAndGetAuth0Secret(): string {
  const secret = process.env.AUTH0_SECRET;

  if (!secret || typeof secret !== 'string' || secret.trim().length === 0) {
    throw new Error(
      'AUTH0_SECRET is required but missing or empty. ' +
      'Generate one with: openssl rand -hex 32'
    );
  }

  if (secret.length < 32) {
    throw new Error(
      `AUTH0_SECRET must be at least 32 characters (got ${secret.length}). ` +
      'Generate one with: openssl rand -hex 32'
    );
  }

  return secret;
}

// Validate other required environment variables (non-blocking, just logging)
function validateAuth0Config() {
  const required = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  };

  const domain = getAuth0Domain();
  if (!domain) {
    logger.error('[Auth0 SDK] Missing AUTH0_DOMAIN or AUTH0_ISSUER_BASE_URL');
  }

  const missing = Object.entries(required)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    logger.error('[Auth0 SDK] Missing required environment variables:', { missing });
  }

  return {
    isValid: missing.length === 0 && !!domain,
    missing,
    domain: domain || 'NOT_SET',
  };
}

// Validate and get AUTH0_SECRET (throws if invalid - fail fast)
const validatedSecret = validateAndGetAuth0Secret();

// Validate other config (non-blocking, just logging)
const configValidation = validateAuth0Config();
if (!configValidation.isValid) {
  logger.error('[Auth0 SDK] Configuration validation failed:', configValidation);
}

export const auth0 = new Auth0Client({
  appBaseUrl: getBaseUrl(),
  secret: validatedSecret,
  domain: getAuth0Domain(),
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParameters: {
    response_type: 'code',
    audience: process.env.AUTH0_AUDIENCE,
    scope: 'openid profile email',
  },
  session: {
    inactivityDuration: 4 * 60 * 60, // 4 hours in seconds (session expires after 4 hours of inactivity)
    absoluteDuration: 24 * 60 * 60, // 24 hours maximum (session expires after 24 hours regardless of activity)
    rolling: true, // Extend session on activity
  },
  routes: {
    login: '/api/auth/login',
    callback: '/api/auth/callback',
    logout: '/api/auth/logout',
  },
  signInReturnToPath: '/webapp', // Redirect to webapp after successful login
  beforeSessionSaved: async (session, idToken) => {
    // Sync user to database on first login or update last_login
    const email = session.user?.email;
    const emailVerified = session.user?.email_verified || false;

    if (email) {
      try {
        await syncUserFromAuth0(email, emailVerified);
        logger.dev('[Auth0 SDK] User synced after callback:', { email });
      } catch (error) {
        // Log error but don't fail authentication
        logger.error('[Auth0 SDK] Failed to sync user after callback:', {
          error: error instanceof Error ? error.message : String(error),
          email,
        });
      }
    }

    return session;
  },
});

/**
 * Check if authentication is required for current environment
 * Development: Bypass authentication (allow access without login)
 * Preview/Production: Require authentication
 */
export function isAuthRequired(): boolean {
  return !isDev;
}

/**
 * Get the detected base URL (for logging/debugging)
 */
export function getDetectedBaseUrl(): string {
  return getBaseUrl();
}
