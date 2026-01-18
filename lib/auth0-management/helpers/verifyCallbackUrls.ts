import { logger } from '@/lib/logger';
import type { CallbackUrlStatus } from '../../auth0-management';
import { getManagementClient } from '../../auth0-management';

/**
 * Verify callback URLs match Auth0 configuration
 */
export async function verifyCallbackUrls(expectedUrls: string[]): Promise<CallbackUrlStatus> {
  const client = getManagementClient();

  if (!client || !process.env.AUTH0_CLIENT_ID) {
    return {
      isValid: false,
      configuredUrls: [],
      expectedUrls,
      missingUrls: expectedUrls,
      extraUrls: [],
    };
  }
  try {
    const auth0ClientId = process.env.AUTH0_CLIENT_ID;
    const appResponse = await client.clients.get({ client_id: auth0ClientId });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const app = appResponse.data || (appResponse as any); // justified

    const configuredUrls = (app.callbacks || []) as string[];
    const missingUrls = expectedUrls.filter(url => !configuredUrls.includes(url));
    const extraUrls = configuredUrls.filter(url => !expectedUrls.includes(url));
    return {
      isValid: missingUrls.length === 0,
      configuredUrls,
      expectedUrls,
      missingUrls,
      extraUrls,
    };
  } catch (error) {
    logger.error('[Auth0 Management] Failed to verify callback URLs:', error);
    return {
      isValid: false,
      configuredUrls: [],
      expectedUrls,
      missingUrls: expectedUrls,
      extraUrls: [],
    };
  }
}
