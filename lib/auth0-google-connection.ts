/**
 * Auth0 Google Connection Management Utilities
 * Handles enabling and verifying Google social connection for the application
 */

import { ManagementClient } from 'auth0';
import { logger } from './logger';

/**
 * Get or create Auth0 Management API client
 * (Reused from auth0-management.ts pattern)
 */
function getManagementClient(): ManagementClient | null {
  const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;

  if (!issuerBaseUrl || !clientId || !clientSecret) {
    return null;
  }

  const domain = issuerBaseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  try {
    return new ManagementClient({
      domain,
      clientId,
      clientSecret,
    });
  } catch (error) {
    logger.error('[Auth0 Google Connection] Failed to create Management API client:', error);
    return null;
  }
}

/**
 * Connection type from Auth0 Management API
 */
export interface Connection {
  id: string;
  name: string;
  strategy: string;
  enabled_clients?: string[];
  is_domain_connection?: boolean;
  options?: Record<string, any>;
}

/**
 * Verify if Google connection is enabled and configured correctly
 *
 * @returns {Promise<boolean>} True if Google connection is enabled and configured
 */
export async function verifyGoogleConnection(): Promise<boolean> {
  const client = getManagementClient();

  if (!client) {
    return false;
  }
  try {
    const connectionsResponse = await client.connections.getAll();
    const connections = Array.isArray(connectionsResponse)
      ? connectionsResponse
      : (connectionsResponse as any)?.data || [];
    if (!connections || !Array.isArray(connections) || connections.length === 0) {
      return false;
    }
    const googleConnection = connections.find(
      (conn: any) => conn.strategy === 'google-oauth2',
    ) as any;
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

/**
 * Enable Google connection for the application if it exists but isn't enabled
 * Note: This only enables the connection for the app. The connection must already exist
 * and be configured with Google OAuth credentials in Auth0 Dashboard.
 *
 * @returns {Promise<{ success: boolean; message: string; enabled?: boolean }>} Result of enabling attempt
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
        'Management API client not available. Check AUTH0_ISSUER_BASE_URL, AUTH0_CLIENT_ID, and AUTH0_CLIENT_SECRET.',
    };
  }

  if (!auth0ClientId) {
    return {
      success: false,
      message: 'AUTH0_CLIENT_ID not set',
    };
  }

  try {
    const connectionsResponse = await client.connections.getAll();
    const connections = Array.isArray(connectionsResponse)
      ? connectionsResponse
      : (connectionsResponse as any)?.data || [];

    if (!connections || !Array.isArray(connections)) {
      return {
        success: false,
        message: 'Failed to fetch connections from Auth0',
      };
    }

    const googleConnection = connections.find(
      (conn: any) => conn.strategy === 'google-oauth2',
    ) as any;

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
          'Google connection exists but isn't configured with OAuth credentials. Please configure it in Auth0 Dashboard > Connections > Social > Google',
      };
    }

    const enabledClients = googleConnection.enabled_clients || [];
    const isEnabled = enabledClients.includes(auth0ClientId);

    if (isEnabled) {
      return {
        success: true,
        message: 'Google connection is already enabled for this application',
        enabled: true,
      };
    }

    // Enable the connection for this application
    const updatedEnabledClients = [...new Set([...enabledClients, auth0ClientId])];

    await client.connections.update(
      { id: googleConnection.id },
      {
        enabled_clients: updatedEnabledClients,
      } as any,
    );

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

