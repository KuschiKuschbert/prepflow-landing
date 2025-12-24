import { getManagementClient } from '@/lib/auth0-management';
import { logger } from '@/lib/logger';

interface EnableConnectionResult {
  success: boolean;
  enabled: boolean;
  message: string;
}

/**
 * Enable connection for application
 */
export async function enableConnectionForApp(
  connection: any,
  applicationClientId: string,
  connectionType: 'apple' | 'microsoft',
  connectionName: string,
): Promise<EnableConnectionResult> {
  const client = getManagementClient();
  if (!client || !applicationClientId) {
    return {
      success: false,
      enabled: false,
      message: 'Auth0 configuration is missing. Please check your Auth0 environment variables.',
    };
  }

  if (!connection) {
    return {
      success: false,
      enabled: false,
      message: `${connectionName} connection not found. Create it in Auth0 Dashboard > Connections > Social > ${connectionName}`,
    };
  }

  if (connection.enabled_clients?.includes(applicationClientId)) {
    return {
      success: true,
      enabled: true,
      message: `${connectionName} connection is already enabled for this application`,
    };
  }

  try {
    const enabledClients = [...(connection.enabled_clients || []), applicationClientId];
    await client.connections.update({ id: connection.id }, { enabled_clients: enabledClients });

    logger.info(`[Auth0 ${connectionType}] Enabled ${connectionName} connection for application`, {
      connectionId: connection.id,
      strategy: connection.strategy,
      applicationClientId,
    });

    return {
      success: true,
      enabled: true,
      message: `${connectionName} connection enabled successfully`,
    };
  } catch (error) {
    logger.error(`[Auth0 ${connectionType}] Failed to enable ${connectionName} connection:`, error);
    return {
      success: false,
      enabled: false,
      message:
        error instanceof Error
          ? `Failed to enable ${connectionName} connection: ${error.message}`
          : `Failed to enable ${connectionName} connection`,
    };
  }
}
