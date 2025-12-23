import { logger } from '@/lib/logger';
import { getManagementClient } from '@/lib/auth0-management';
import { getGoogleConnection } from './getGoogleConnection';

/**
 * Configure Google OAuth credentials for the connection
 */
export async function configureGoogleOAuthCredentials(
  googleClientId: string,
  googleClientSecret: string,
): Promise<{ success: boolean; message: string }> {
  const client = getManagementClient();

  if (!client) {
    return {
      success: false,
      message:
        'Management API client not available. Check AUTH0_ISSUER_BASE_URL, AUTH0_CLIENT_ID, and AUTH0_CLIENT_SECRET.',
    };
  }

  if (!googleClientId || !googleClientSecret) {
    return {
      success: false,
      message: 'Google Client ID and Client Secret are required',
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

    const googleConnection = await getGoogleConnection(client);

    if (!googleConnection) {
      return {
        success: false,
        message:
          "Google connection doesn't exist. Please create it in Auth0 Dashboard > Connections > Social > Google",
      };
    }

    await client.connections.update(
      { id: googleConnection.id },
      {
        options: {
          ...googleConnection.options,
          client_id: googleClientId,
          client_secret: googleClientSecret,
          scope: ['email', 'profile'],
        },
      } as any,
    );

    logger.info('[Auth0 Google Connection] Configured Google OAuth credentials', {
      connectionId: googleConnection.id,
    });

    return {
      success: true,
      message: 'Google OAuth credentials configured successfully',
    };
  } catch (error) {
    logger.error('[Auth0 Google Connection] Failed to configure Google OAuth credentials:', error);
    return {
      success: false,
      message: `Failed to configure Google OAuth credentials: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

