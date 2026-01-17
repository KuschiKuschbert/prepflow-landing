import { getManagementClient } from '@/lib/auth0-management';
import { logger } from '@/lib/logger';
import { getGoogleConnection } from './getGoogleConnection';

/**
 * Enable Google connection for the application
 */
export async function enableGoogleConnectionForApp(): Promise<{
  success: boolean;
  message: string;
  enabled?: boolean;
}> {
  const client = getManagementClient();
  const auth0ClientId = process.env.AUTH0_CLIENT_ID;

  if (!client) {
    return {
      success: false,
      message:
        'Auth0 configuration is missing. Please check your AUTH0_ISSUER_BASE_URL, AUTH0_CLIENT_ID, and AUTH0_CLIENT_SECRET environment variables.',
    };
  }

  if (!auth0ClientId) {
    return {
      success: false,
      message: 'AUTH0_CLIENT_ID not set',
    };
  }

  try {
    const googleConnection = await getGoogleConnection(client);
    if (!googleConnection) {
      return {
        success: false,
        message:
          "Google connection doesn't exist. Please create it in Auth0 Dashboard > Connections > Social > Google",
      };
    }
    if (!googleConnection.options?.client_id) {
      return {
        success: false,
        message:
          "Google connection exists but isn't configured with OAuth credentials. Please configure it in Auth0 Dashboard > Connections > Social > Google",
      };
    }
    const enabledClients = googleConnection.enabled_clients || [];
    if (enabledClients.includes(auth0ClientId)) {
      return {
        success: true,
        message: 'Google connection is already enabled for this application',
        enabled: true,
      };
    }
    if (!googleConnection.id) {
      return {
        success: false,
        message: 'Google connection ID is missing',
      };
    }

    await client.connections.update({ id: googleConnection.id }, {
      enabled_clients: [...new Set([...enabledClients, auth0ClientId])],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    logger.info('[Auth0 Google Connection] Enabled Google connection for application', {
      connectionId: googleConnection.id,
      clientId: auth0ClientId,
    });
    return {
      success: true,
      message: 'Google connection enabled successfully for this application',
      enabled: true,
    };
  } catch (error) {
    logger.error('[Auth0 Google Connection] Failed to enable Google connection:', error);
    return {
      success: false,
      message: `Failed to enable Google connection: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
