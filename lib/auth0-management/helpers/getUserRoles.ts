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
    const response = await client.users.roles.list(auth0UserId);
    const roles = response.data;

    if (!roles || !Array.isArray(roles)) {
      return [];
    }

    const roleNames = roles
      .map((role: unknown) => {
        if (typeof role === 'string') return role;
        if (typeof role === 'object' && role !== null && 'name' in role) {
          return (role as { name: string }).name;
        }
        return null;
      })
      .filter((name): name is string => Boolean(name));

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
