/**
 * Auth0 Management API utilities
 * Fetches user roles from Auth0 Management API when not included in token
 */

import { ManagementClient } from 'auth0';
import { logger } from './logger';

let managementClient: ManagementClient | null = null;

/**
 * Get or create Auth0 Management API client
 */
function getManagementClient(): ManagementClient | null {
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

/**
 * Get user roles from Auth0 Management API
 *
 * @param {string} auth0UserId - Auth0 user ID (e.g., "google-oauth2|102050647966509234700")
 * @returns {Promise<string[]>} Array of role names
 */
export async function getUserRoles(auth0UserId: string): Promise<string[]> {
  const client = getManagementClient();

  if (!client) {
    logger.warn('[Auth0 Management] Management API client not available');
    return [];
  }

  try {
    // Get user roles from Auth0 Management API
    const roles = await client.users.getRoles({ id: auth0UserId });

    if (!roles || !Array.isArray(roles)) {
      return [];
    }

    // Extract role names from role objects
    const roleNames = roles.map((role: any) => role.name || role).filter(Boolean);

    if (roleNames.length > 0) {
      logger.dev(
        `[Auth0 Management] Fetched ${roleNames.length} roles for user ${auth0UserId}:`,
        roleNames,
      );
    }

    return roleNames;
  } catch (error) {
    logger.error(`[Auth0 Management] Failed to fetch roles for user ${auth0UserId}:`, error);
    return [];
  }
}

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
  id: string;
  name: string;
  strategy: string;
  enabled_clients?: string[];
  is_domain_connection?: boolean;
  options?: Record<string, any>;
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

/**
 * Get all social connections from Auth0
 *
 * @returns {Promise<Connection[]>} Array of social connections
 */
export async function getSocialConnections(): Promise<Connection[]> {
  const client = getManagementClient();

  if (!client) {
    return [];
  }
  try {
    const connectionsResponse = await client.connections.getAll();
    const connections = Array.isArray(connectionsResponse)
      ? connectionsResponse
      : (connectionsResponse as any)?.data || [];
    if (!connections || !Array.isArray(connections)) {
      return [];
    }
    return connections.filter(
      (conn: any) =>
        ['google-oauth2', 'facebook', 'github', 'twitter', 'linkedin', 'apple'].includes(
          conn.strategy,
        ) ||
        (conn.strategy === 'oauth2' && !conn.is_domain_connection),
    ) as Connection[];
  } catch (error) {
    logger.error('[Auth0 Management] Failed to fetch social connections:', error);
    return [];
  }
}

// Google connection functions moved to lib/auth0-google-connection.ts
// Re-export for backward compatibility
export { verifyGoogleConnection, enableGoogleConnectionForApp } from './auth0-google-connection';

/**
 * Verify callback URLs match Auth0 configuration
 *
 * @param {string[]} expectedUrls - Expected callback URLs
 * @returns {Promise<CallbackUrlStatus>} Callback URL verification status
 */
export async function verifyCallbackUrls(expectedUrls: string[]): Promise<CallbackUrlStatus> {
  const client = getManagementClient();

  if (!client || !process.env.AUTH0_CLIENT_ID) {
    return {
      isValid: false,
      configuredUrls: [],
      expectedUrls,
      missingUrls: expectedUrls,
      extraUrls: [],
    };
  }
  try {
    const auth0ClientId = process.env.AUTH0_CLIENT_ID;

    // Get application configuration
    const appResponse = await client.clients.get({ client_id: auth0ClientId });
    const app = appResponse.data || (appResponse as any);

    const configuredUrls = (app.callbacks || []) as string[];

    // Find missing and extra URLs
    const missingUrls = expectedUrls.filter(url => !configuredUrls.includes(url));
    const extraUrls = configuredUrls.filter(url => !expectedUrls.includes(url));
    return {
      isValid: missingUrls.length === 0,
      configuredUrls,
      expectedUrls,
      missingUrls,
      extraUrls,
    };
  } catch (error) {
    logger.error('[Auth0 Management] Failed to verify callback URLs:', error);
    return {
      isValid: false,
      configuredUrls: [],
      expectedUrls,
      missingUrls: expectedUrls,
      extraUrls: [],
    };
  }
}

/**
 * Get user profile from Auth0 Management API
 *
 * @param {string} auth0UserId - Auth0 user ID (e.g., "google-oauth2|102050647966509234700")
 * @returns {Promise<any>} User profile object or null if not found
 */
export async function getUserProfileFromManagementAPI(auth0UserId: string): Promise<any | null> {
  const client = getManagementClient();

  if (!client) {
    return null;
  }
  try {
    const userResponse = await client.users.get({ id: auth0UserId });
    const user = (userResponse as any)?.data || userResponse;
    if (!user) {
      return null;
    }
    return {
      sub: user.user_id || auth0UserId,
      email: user.email,
      email_verified: user.email_verified || false,
      name: user.name,
      nickname: user.nickname,
      picture: user.picture,
      given_name: user.given_name,
      family_name: user.family_name,
    };
  } catch (error) {
    logger.error(`[Auth0 Management] Failed to fetch user profile for ${auth0UserId}:`, error);
    return null;
  }
}

/**
 * Fetch user profile with timeout and retry logic
 * Used in JWT callback to ensure email is always available
 *
 * @param {string} auth0UserId - Auth0 user ID (e.g., "google-oauth2|102050647966509234700")
 * @param {string} [fallbackEmail] - Fallback email if Management API fails
 * @returns {Promise<string | undefined>} User email or fallback email, undefined if both fail
 */
export async function fetchProfileWithRetry(
  auth0UserId: string,
  fallbackEmail?: string,
): Promise<string | undefined> {
  const timeout = 5000; // 5 seconds
  const maxRetries = 1;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const profilePromise = getUserProfileFromManagementAPI(auth0UserId);
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Management API timeout')), timeout),
      );

      const profile = await Promise.race([profilePromise, timeoutPromise]);
      if (profile?.email) {
        logger.dev(`[Auth0 Management] Profile fetched successfully (attempt ${attempt + 1})`);
        return profile.email;
      }
      // Profile exists but no email - use fallback
      if (profile && !profile.email) {
        logger.warn(`[Auth0 Management] Profile found but email missing for ${auth0UserId}`);
        return fallbackEmail;
      }
    } catch (error) {
      if (attempt === maxRetries) {
        logger.warn(
          `[Auth0 Management] Failed after ${maxRetries + 1} attempts for ${auth0UserId}:`,
          error instanceof Error ? error.message : String(error),
        );
        return fallbackEmail;
      }
      // Retry after short delay
      logger.dev(`[Auth0 Management] Retry attempt ${attempt + 1}/${maxRetries} for ${auth0UserId}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return fallbackEmail;
}
