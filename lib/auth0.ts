/**
 * Auth0 SDK Client Instance
 * Auth0 SDK v4 uses a singleton client instance
 */
import { createAuth0Client } from './auth0/helpers/createAuth0Client';
import { getBaseUrl } from './auth0/helpers/getBaseUrl';
import { validateAuth0Config } from './auth0/helpers/validateAuth0Config';
import { logger } from './logger';

const isDev = process.env.NODE_ENV === 'development';

const configValidation = validateAuth0Config();
if (!configValidation.isValid) {
  logger.error('[Auth0 SDK] Configuration validation failed:', configValidation);
}

// Create base client
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
