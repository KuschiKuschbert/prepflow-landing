import { logger } from '@/lib/logger';
import { getManagementClient } from '../../auth0-management';

/**
 * Get user roles from Auth0 Management API
 */
export async function getUserRoles(auth0UserId: string): Promise<string[]> {
  const client = getManagementClient();

  if (!client) {
    logger.warn('[Auth0 Management] Management API client not available');
    return [];
  }

  try {
    const roles = await client.users.getRoles({ id: auth0UserId });

    if (!roles || !Array.isArray(roles)) {
      return [];
    }

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
