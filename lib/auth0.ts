/**
 * Auth0 SDK Client Instance
 * Auth0 SDK v4 uses a singleton client instance
 */
import { logger } from './logger';
import { createAuth0Client } from './auth0/helpers/createAuth0Client';
import { validateAuth0Config } from './auth0/helpers/validateAuth0Config';
import { getBaseUrl } from './auth0/helpers/getBaseUrl';

const isDev = process.env.NODE_ENV === 'development';

const configValidation = validateAuth0Config();
if (!configValidation.isValid) {
  logger.error('[Auth0 SDK] Configuration validation failed:', configValidation);
}

export const auth0 = createAuth0Client();

/**
 * Check if authentication is required for current environment
 * Development: Bypass authentication (allow access without login)
 * Preview/Production: Require authentication
 */
export function isAuthRequired(): boolean {
  return !isDev;
}

/** Get the detected base URL (for logging/debugging) */
export function getDetectedBaseUrl(): string {
  return getBaseUrl();
}
