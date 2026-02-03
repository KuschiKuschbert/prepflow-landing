import { Connection } from '@/lib/auth0-management';
import { ManagementClient } from 'auth0';

/**
 * Get Google connection from Auth0
 */
export async function getGoogleConnection(client: ManagementClient): Promise<Connection | null> {
  const response = await client.connections.list();
  const connections = response.data;
  if (!connections || !Array.isArray(connections)) {
    return null;
  }
  return (connections.find(conn => conn.strategy === 'google-oauth2') || null) as Connection | null;
}
