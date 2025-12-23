/**
 * Auth0 Google Connection Management Utilities
 * Handles enabling and verifying Google social connection for the application
 */
import { verifyGoogleConnection } from './auth0-google-connection/helpers/verifyGoogleConnection';
import { configureGoogleOAuthCredentials } from './auth0-google-connection/helpers/configureGoogleOAuth';
import { enableGoogleConnectionForApp } from './auth0-google-connection/helpers/enableGoogleConnection';

export interface Connection {
  id: string;
  name: string;
  strategy: string;
  enabled_clients?: string[];
  is_domain_connection?: boolean;
  options?: Record<string, any>;
}

/** Verify if Google connection is enabled and configured correctly */
export { verifyGoogleConnection };

/** Configure Google OAuth credentials for the connection */
export { configureGoogleOAuthCredentials };

/** Configure Google OAuth credentials and enable connection for the application */
export async function configureAndEnableGoogleConnection(
  googleClientId: string,
  googleClientSecret: string,
): Promise<{
  success: boolean;
  message: string;
  configured?: boolean;
  enabled?: boolean;
}> {
  const configureResult = await configureGoogleOAuthCredentials(googleClientId, googleClientSecret);
  if (!configureResult.success) {
    return {
      success: false,
      message: configureResult.message,
      configured: false,
    };
  }

  const enableResult = await enableGoogleConnectionForApp();
  if (!enableResult.success) {
    return {
      success: false,
      message: `OAuth credentials configured, but failed to enable connection: ${enableResult.message}`,
      configured: true,
      enabled: false,
    };
  }

  return {
    success: true,
    message: 'Google OAuth credentials configured and connection enabled successfully',
    configured: true,
    enabled: enableResult.enabled,
  };
}

/** Enable Google connection for the application */
export { enableGoogleConnectionForApp };
