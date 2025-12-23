import { logger } from '@/lib/logger';
import { getAuth0Domain } from './getAuth0Domain';

/**
 * Validate Auth0 configuration (non-blocking, just logging)
 */
export function validateAuth0Config() {
  const required = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  };

  const domain = getAuth0Domain();
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

