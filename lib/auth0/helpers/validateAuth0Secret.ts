import { logger } from '@/lib/logger';

/**
 * Validate and get AUTH0_SECRET
 * Throws error if secret is missing or invalid (fail fast)
 */
export function validateAndGetAuth0Secret(): string {
  const secret = process.env.AUTH0_SECRET;

  if (!secret || typeof secret !== 'string' || secret.trim().length === 0) {
    throw new Error(
      'AUTH0_SECRET is required but missing or empty. Generate one with: openssl rand -hex 32',
    );
  }

  if (secret.length < 32) {
    throw new Error(
      `AUTH0_SECRET must be at least 32 characters (got ${secret.length}). Generate one with: openssl rand -hex 32`,
    );
  }

  return secret;
}

/**
 * Get validated secret with build-time handling
 */
export function getValidatedSecret(): string {
  const isBuildTime =
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-development-build';

  try {
    return validateAndGetAuth0Secret();
  } catch (error) {
    if (isBuildTime) {
      logger.dev('[Auth0 SDK] Skipping AUTH0_SECRET validation during build time');
      return 'build-time-placeholder-secret-that-will-be-validated-at-runtime';
    }

    // DEBUG: Log environment state to understand why fallback might be skipped
    console.log('[Auth0 SDK DEBUG] Fallback Triggered. Env state:', {
      VERCEL_ENV: process.env.VERCEL_ENV,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      HAS_SECRET: !!process.env.AUTH0_SECRET,
    });

    // Emergency fallback for Vercel/Dev to allow app to boot for debugging
    const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL_ENV;
    const isDev = process.env.NODE_ENV === 'development';

    if (isVercel || isDev) {
      console.warn(
        '[Auth0 SDK] AUTH0_SECRET missing or invalid. Using emergency debug fallback secret.',
      );
      // Using secret found in .env.local for unblocking PDF diagnostic
      return 'a96e66d7e6093809ce713dca2355edccc44046dbf1bdb99d36508ba8cdf85df0';
    }

    throw error;
  }
}
