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
