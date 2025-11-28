/**
 * OAuth flow handling for Google Drive.
 */

import { logger } from '@/lib/logger';
import { getOAuth2Client } from './oauth-client';
import { storeEncryptedRefreshToken } from './token-management';
import { generateSecureState, verifySecureState } from './oauth-state';

/**
 * Get Google Drive authorization URL for OAuth flow.
 *
 * @param {string} userId - User ID (email)
 * @returns {string} Authorization URL
 */
export function getGoogleDriveAuthUrl(userId: string): string {
  const oauth2Client = getOAuth2Client();

  const scopes = ['https://www.googleapis.com/auth/drive.file']; // Limited scope for file access only

  // Generate secure state token with user ID
  const stateToken = generateSecureState(userId);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent', // Force consent to get refresh token
    state: stateToken, // Secure state token with user ID
  });

  return authUrl;
}

/**
 * Handle OAuth callback and store refresh token.
 *
 * @param {string} code - Authorization code from OAuth callback
 * @param {string} stateToken - Secure state token from OAuth callback
 * @param {string} expectedUserId - Expected user ID from authenticated session (for verification)
 * @returns {Promise<void>}
 */
export async function handleGoogleDriveCallback(
  code: string,
  stateToken: string,
  expectedUserId: string,
): Promise<void> {
  // Verify state token and extract user ID
  const userIdFromState = verifySecureState(stateToken);

  // Security check: Ensure state token matches authenticated user
  if (userIdFromState !== expectedUserId) {
    logger.error(
      `[Google Drive] State token mismatch: expected ${expectedUserId}, got ${userIdFromState}`,
    );
    throw new Error('OAuth state verification failed. User ID mismatch.');
  }

  const oauth2Client = getOAuth2Client();

  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.refresh_token) {
    throw new Error('No refresh token received from Google');
  }

  // Store refresh token (encrypted) for the verified user
  await storeEncryptedRefreshToken(expectedUserId, tokens.refresh_token);

  logger.info(`[Google Drive] Successfully connected for user ${expectedUserId}`);
}
