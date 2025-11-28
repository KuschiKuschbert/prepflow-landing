/**
 * Google Drive authentication.
 */

import { logger } from '@/lib/logger';
import type { Auth } from 'googleapis';
import { getOAuth2Client } from './oauth-client';
import { getEncryptedRefreshToken } from './token-management';

/**
 * Authenticate Google Drive for a user.
 *
 * @param {string} userId - User ID (email)
 * @returns {Promise<auth.OAuth2Client>} Authenticated OAuth2 client
 */
export async function authenticateGoogleDrive(userId: string): Promise<Auth.OAuth2Client> {
  const oauth2Client = getOAuth2Client();

  // Try to get stored refresh token
  const encryptedRefreshToken = await getEncryptedRefreshToken(userId);

  if (encryptedRefreshToken) {
    // Set credentials with refresh token
    oauth2Client.setCredentials({
      refresh_token: encryptedRefreshToken, // Should be decrypted
    });

    // Try to refresh access token
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
      return oauth2Client;
    } catch (error) {
      logger.warn(
        `[Google Drive] Failed to refresh token for user ${userId}, re-authentication required`,
      );
      throw new Error('Google Drive authentication expired. Please reconnect.');
    }
  }

  throw new Error('Google Drive not connected. Please connect your Google account first.');
}
