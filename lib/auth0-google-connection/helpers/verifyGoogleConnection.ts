import { logger } from '@/lib/logger';
import { getManagementClient } from '@/lib/auth0-management';
import { getGoogleConnection } from './getGoogleConnection';

/**
 * Verify if Google connection is enabled and configured correctly
 */
export async function verifyGoogleConnection(): Promise<boolean> {
  const client = getManagementClient();
  if (!client) {
    return false;
  }
  try {
    const googleConnection = await getGoogleConnection(client);
    if (!googleConnection) {
      return false;
    }
    const auth0ClientId = process.env.AUTH0_CLIENT_ID;
    if (
      auth0ClientId &&
      googleConnection.enabled_clients &&
      !googleConnection.enabled_clients.includes(auth0ClientId)
    ) {
      return false;
    }
    return !!googleConnection.options?.client_id;
  } catch (error) {
    logger.error('[Auth0 Google Connection] Failed to verify Google connection:', error);
    return false;
  }
}
