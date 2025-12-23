import { ManagementClient } from 'auth0';

/**
 * Get Google connection from Auth0
 */
export async function getGoogleConnection(client: ManagementClient): Promise<any> {
  const connectionsResponse = await client.connections.getAll();
  const connections = Array.isArray(connectionsResponse)
    ? connectionsResponse
    : (connectionsResponse as any)?.data || [];
  if (!connections || !Array.isArray(connections)) {
    return null;
  }
  return connections.find((conn: any) => conn.strategy === 'google-oauth2') as any;
}

