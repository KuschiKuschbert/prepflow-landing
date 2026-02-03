import { logger } from '@/lib/logger';
import type { Connection } from '../../auth0-management';
import { getManagementClient } from '../../auth0-management';

/**
 * Get all social connections from Auth0
 */
export async function getSocialConnections(): Promise<Connection[]> {
  const client = getManagementClient();

  if (!client) {
    return [];
  }
  try {
    const response = await client.connections.list();
    const connections = response.data;
    if (!connections || !Array.isArray(connections)) {
      return [];
    }
    return connections.filter(
      (conn: Connection) =>
        conn.strategy &&
        ([
          'google-oauth2',
          'facebook',
          'github',
          'twitter',
          'linkedin',
          'apple',
          'windowslive',
          'waad',
        ].includes(conn.strategy) ||
          (conn.strategy === 'oauth2' && !conn.is_domain_connection)),
    );
  } catch (error) {
    logger.error('[Auth0 Management] Failed to fetch social connections:', error);
    return [];
  }
}
