import { logger } from '@/lib/logger';
import { getAuth0Domain } from './getAuth0Domain';

/**
 * Validate Auth0 configuration (non-blocking, just logging)
 */
export function validateAuth0Config() {
  const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL_ENV;
  const isDev = process.env.NODE_ENV === 'development';
  const isDebug = isVercel || isDev;

  const required = {
    AUTH0_CLIENT_ID:
      process.env.AUTH0_CLIENT_ID || (isDebug ? 'CO3Vl37SuZ4e9wke1PitgWvAUyMR2HfL' : ''),
    AUTH0_CLIENT_SECRET:
      process.env.AUTH0_CLIENT_SECRET ||
      (isDebug ? 'zlbcaViOHPG27NhE1KwcQjUp8aiOTILCgVAX0kR1IzSM0bxs1BVpv8KL9uIeqgX_' : ''),
  };

  let domain = getAuth0Domain();
  if (!domain && isDebug) {
    domain = 'auth.prepflow.org';
  }

  if (!domain) {
    logger.error('[Auth0 SDK] Missing AUTH0_DOMAIN or AUTH0_ISSUER_BASE_URL');
  }

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
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
