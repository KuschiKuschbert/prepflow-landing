/**
 * Auth0 Apple and Microsoft Connection Utilities
 * Functions to verify and enable Apple and Microsoft social connections
 */

import { getManagementClient } from './auth0-management';
import { logger } from './logger';

/**
 * Get Auth0 application client ID
 */
function getApplicationClientId(): string | null {
  return process.env.AUTH0_CLIENT_ID || null;
}

/**
 * Verify Apple connection is enabled for the application
 *
 * @returns {Promise<boolean>} True if Apple connection is enabled
 */
export async function verifyAppleConnection(): Promise<boolean> {
  const client = getManagementClient();
  const applicationClientId = getApplicationClientId();

  if (!client || !applicationClientId) {
    return false;
  }

  try {
    const connections = await client.connections.getAll();
    const connectionsList = Array.isArray(connections)
      ? connections
      : (connections as any)?.data || [];

    const appleConnection = connectionsList.find((conn: any) => conn.strategy === 'apple');

    if (!appleConnection) {
      logger.dev('[Auth0 Apple] Apple connection not found');
      return false;
    }

    const isEnabled = appleConnection.enabled_clients?.includes(applicationClientId) || false;

    logger.dev('[Auth0 Apple] Connection status:', {
      id: appleConnection.id,
      name: appleConnection.name,
      enabled: isEnabled,
    });

    return isEnabled;
  } catch (error) {
    logger.error('[Auth0 Apple] Failed to verify Apple connection:', error);
    return false;
  }
}

/**
 * Verify Microsoft connection is enabled for the application
 *
 * @returns {Promise<boolean>} True if Microsoft connection is enabled
 */
export async function verifyMicrosoftConnection(): Promise<boolean> {
  const client = getManagementClient();
  const applicationClientId = getApplicationClientId();

  if (!client || !applicationClientId) {
    return false;
  }

  try {
    const connections = await client.connections.getAll();
    const connectionsList = Array.isArray(connections)
      ? connections
      : (connections as any)?.data || [];

    // Microsoft can use 'windowslive' or 'waad' (Windows Azure AD) strategy
    const microsoftConnection = connectionsList.find(
      (conn: any) => conn.strategy === 'windowslive' || conn.strategy === 'waad',
    );

    if (!microsoftConnection) {
      logger.dev('[Auth0 Microsoft] Microsoft connection not found');
      return false;
    }

    const isEnabled = microsoftConnection.enabled_clients?.includes(applicationClientId) || false;

    logger.dev('[Auth0 Microsoft] Connection status:', {
      id: microsoftConnection.id,
      name: microsoftConnection.name,
      strategy: microsoftConnection.strategy,
      enabled: isEnabled,
    });

    return isEnabled;
  } catch (error) {
    logger.error('[Auth0 Microsoft] Failed to verify Microsoft connection:', error);
    return false;
  }
}

/**
 * Enable Apple connection for the application
 *
 * @returns {Promise<{ success: boolean; enabled: boolean; message: string }>}
 */
export async function enableAppleConnectionForApp(): Promise<{
  success: boolean;
  enabled: boolean;
  message: string;
}> {
  const client = getManagementClient();
  const applicationClientId = getApplicationClientId();

  if (!client || !applicationClientId) {
    return {
      success: false,
      enabled: false,
      message: 'Management API client or application client ID not available',
    };
  }

  try {
    const connections = await client.connections.getAll();
    const connectionsList = Array.isArray(connections)
      ? connections
      : (connections as any)?.data || [];

    const appleConnection = connectionsList.find((conn: any) => conn.strategy === 'apple');

    if (!appleConnection) {
      return {
        success: false,
        enabled: false,
        message:
          'Apple connection not found. Create it in Auth0 Dashboard > Connections > Social > Apple',
      };
    }

    // Check if already enabled
    if (appleConnection.enabled_clients?.includes(applicationClientId)) {
      return {
        success: true,
        enabled: true,
        message: 'Apple connection is already enabled for this application',
      };
    }

    // Enable connection for application
    const enabledClients = [...(appleConnection.enabled_clients || []), applicationClientId];

    await client.connections.update(
      { id: appleConnection.id },
      { enabled_clients: enabledClients },
    );

    logger.info('[Auth0 Apple] Enabled Apple connection for application', {
      connectionId: appleConnection.id,
      applicationClientId,
    });

    return {
      success: true,
      enabled: true,
      message: 'Apple connection enabled successfully',
    };
  } catch (error) {
    logger.error('[Auth0 Apple] Failed to enable Apple connection:', error);
    return {
      success: false,
      enabled: false,
      message:
        error instanceof Error
          ? `Failed to enable Apple connection: ${error.message}`
          : 'Failed to enable Apple connection',
    };
  }
}

/**
 * Enable Microsoft connection for the application
 *
 * @returns {Promise<{ success: boolean; enabled: boolean; message: string }>}
 */
export async function enableMicrosoftConnectionForApp(): Promise<{
  success: boolean;
  enabled: boolean;
  message: string;
}> {
  const client = getManagementClient();
  const applicationClientId = getApplicationClientId();

  if (!client || !applicationClientId) {
    return {
      success: false,
      enabled: false,
      message: 'Management API client or application client ID not available',
    };
  }

  try {
    const connections = await client.connections.getAll();
    const connectionsList = Array.isArray(connections)
      ? connections
      : (connections as any)?.data || [];

    // Microsoft can use 'windowslive' or 'waad' (Windows Azure AD) strategy
    const microsoftConnection = connectionsList.find(
      (conn: any) => conn.strategy === 'windowslive' || conn.strategy === 'waad',
    );

    if (!microsoftConnection) {
      return {
        success: false,
        enabled: false,
        message:
          'Microsoft connection not found. Create it in Auth0 Dashboard > Connections > Social > Microsoft',
      };
    }

    // Check if already enabled
    if (microsoftConnection.enabled_clients?.includes(applicationClientId)) {
      return {
        success: true,
        enabled: true,
        message: 'Microsoft connection is already enabled for this application',
      };
    }

    // Enable connection for application
    const enabledClients = [...(microsoftConnection.enabled_clients || []), applicationClientId];

    await client.connections.update(
      { id: microsoftConnection.id },
      { enabled_clients: enabledClients },
    );

    logger.info('[Auth0 Microsoft] Enabled Microsoft connection for application', {
      connectionId: microsoftConnection.id,
      strategy: microsoftConnection.strategy,
      applicationClientId,
    });

    return {
      success: true,
      enabled: true,
      message: 'Microsoft connection enabled successfully',
    };
  } catch (error) {
    logger.error('[Auth0 Microsoft] Failed to enable Microsoft connection:', error);
    return {
      success: false,
      enabled: false,
      message:
        error instanceof Error
          ? `Failed to enable Microsoft connection: ${error.message}`
          : 'Failed to enable Microsoft connection',
    };
  }
}
