/**
 * Auth0 Management API utilities
 * Fetches user roles from Auth0 Management API when not included in token
 */
import { ManagementClient } from 'auth0';
import { fetchProfileWithRetry } from './auth0-management/helpers/fetchProfileWithRetry';
import { getSocialConnections } from './auth0-management/helpers/getSocialConnections';
import { getUserProfileFromManagementAPI } from './auth0-management/helpers/getUserProfile';
import { getUserRoles } from './auth0-management/helpers/getUserRoles';
import { verifyCallbackUrls } from './auth0-management/helpers/verifyCallbackUrls';
import { logger } from './logger';

let managementClient: ManagementClient | null = null;

/**
 * Get or create Auth0 Management API client
 */
export function getManagementClient(): ManagementClient | null {
  const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;

  if (!issuerBaseUrl || !clientId || !clientSecret) {
    return null;
  }

  // Extract domain from issuer URL (e.g., https://dev-xxx.us.auth0.com -> dev-xxx.us.auth0.com)
  const domain = issuerBaseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  if (!managementClient) {
    try {
      managementClient = new ManagementClient({
        domain,
        clientId,
        clientSecret,
      });
    } catch (error) {
      logger.error('[Auth0 Management] Failed to create Management API client:', error);
      return null;
    }
  }

  return managementClient;
}

/** Get user roles from Auth0 Management API */
export { getUserRoles };

/**
 * Extract Auth0 user ID from NextAuth token sub claim
 * Auth0 sub format: "provider|user_id" (e.g., "google-oauth2|102050647966509234700")
 *
 * @param {string} sub - NextAuth token sub claim
 * @returns {string | null} Auth0 user ID or null if invalid format
 */
export function extractAuth0UserId(sub: string | undefined): string | null {
  if (!sub || typeof sub !== 'string') {
    return null;
  }

  // Auth0 sub format: "provider|user_id"
  // This is the format Auth0 uses for user IDs
  return sub;
}

/**
 * Connection type from Auth0 Management API
 */
export interface Connection {
  id?: string;
  name?: string;
  strategy?: string;
  enabled_clients?: string[];
  is_domain_connection?: boolean;
  options?: Record<string, unknown>;
}

/**
 * Callback URL verification status
 */
export interface CallbackUrlStatus {
  isValid: boolean;
  configuredUrls: string[];
  expectedUrls: string[];
  missingUrls: string[];
  extraUrls: string[];
}

/** Get all social connections from Auth0 */
export { getSocialConnections };

// Google connection functions moved to lib/auth0-google-connection.ts
// Re-export for backward compatibility
    export { enableGoogleConnectionForApp, verifyGoogleConnection } from './auth0-google-connection';

/** Verify callback URLs match Auth0 configuration */
export { verifyCallbackUrls };

/** Get user profile from Auth0 Management API */
    export { getUserProfileFromManagementAPI };

/** Fetch user profile with timeout and retry logic */
    export { fetchProfileWithRetry };
