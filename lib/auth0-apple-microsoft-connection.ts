/**
 * Auth0 Apple and Microsoft Connection Utilities
 * Functions to verify and enable Apple and Microsoft social connections
 */
import {
  findAppleConnection,
  findMicrosoftConnection,
} from './auth0-apple-microsoft-connection/helpers/findConnection';
import { verifyConnectionEnabled } from './auth0-apple-microsoft-connection/helpers/verifyConnection';
import { enableConnectionForApp } from './auth0-apple-microsoft-connection/helpers/enableConnection';

function getApplicationClientId(): string | null {
  return process.env.AUTH0_CLIENT_ID || null;
}

/**
 * Verify Apple connection is enabled for the application
 *
 * @returns {Promise<boolean>} True if Apple connection is enabled
 */
export async function verifyAppleConnection(): Promise<boolean> {
  const applicationClientId = getApplicationClientId();
  if (!applicationClientId) {
    return false;
  }

  const appleConnection = await findAppleConnection();
  return verifyConnectionEnabled(appleConnection, applicationClientId, 'apple');
}

/**
 * Verify Microsoft connection is enabled for the application
 *
 * @returns {Promise<boolean>} True if Microsoft connection is enabled
 */
export async function verifyMicrosoftConnection(): Promise<boolean> {
  const applicationClientId = getApplicationClientId();
  if (!applicationClientId) {
    return false;
  }

  const microsoftConnection = await findMicrosoftConnection();
  return verifyConnectionEnabled(microsoftConnection, applicationClientId, 'microsoft');
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
  const applicationClientId = getApplicationClientId();
  if (!applicationClientId) {
    return {
      success: false,
      enabled: false,
      message: 'Auth0 configuration is missing. Please check your Auth0 environment variables.',
    };
  }

  const appleConnection = await findAppleConnection();
  return enableConnectionForApp(appleConnection, applicationClientId, 'apple', 'Apple');
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
  const applicationClientId = getApplicationClientId();
  if (!applicationClientId) {
    return {
      success: false,
      enabled: false,
      message: 'Auth0 configuration is missing. Please check your Auth0 environment variables.',
    };
  }

  const microsoftConnection = await findMicrosoftConnection();
  return enableConnectionForApp(microsoftConnection, applicationClientId, 'microsoft', 'Microsoft');
}
