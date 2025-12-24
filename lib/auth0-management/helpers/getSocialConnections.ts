import { logger } from '@/lib/logger';
import { getManagementClient } from '../../auth0-management';
import type { Connection } from '../../auth0-management';

/**
 * Get all social connections from Auth0
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
        [
          'google-oauth2',
          'facebook',
          'github',
          'twitter',
          'linkedin',
          'apple',
          'windowslive',
          'waad',
        ].includes(conn.strategy) ||
        (conn.strategy === 'oauth2' && !conn.is_domain_connection),
    ) as Connection[];
  } catch (error) {
    logger.error('[Auth0 Management] Failed to fetch social connections:', error);
    return [];
  }
}
