/**
 * OAuth state token generation and verification for Google Drive.
 */

import { logger } from '@/lib/logger';

/**
 * Generate a secure state token for OAuth flow.
 * Includes user ID and a timestamp for validation.
 *
 * @param {string} userId - User ID (email)
 * @returns {string} Base64 encoded state token
 */
export function generateSecureState(userId: string): string {
  const stateData = {
    userId,
    timestamp: Date.now(),
    nonce: crypto.getRandomValues(new Uint8Array(16)).toString(),
  };
  return Buffer.from(JSON.stringify(stateData)).toString('base64');
}

/**
 * Verify and extract user ID from secure state token.
 *
 * @param {string} stateToken - State token from OAuth callback
 * @param {number} maxAgeMs - Maximum age of state token in milliseconds (default: 10 minutes)
 * @returns {string} User ID if valid
 * @throws {Error} If state is invalid or expired
 */
export function verifySecureState(stateToken: string, maxAgeMs: number = 10 * 60 * 1000): string {
  try {
    const stateData = JSON.parse(Buffer.from(stateToken, 'base64').toString());
    const age = Date.now() - stateData.timestamp;

    if (age > maxAgeMs) {
      throw new Error('OAuth state token expired');
    }

    if (!stateData.userId) {
      throw new Error('Invalid OAuth state token: missing userId');
    }

    return stateData.userId;
  } catch (error: any) {
    logger.error('[Google Drive] Failed to verify state token:', error);
    throw new Error('Invalid OAuth state token');
  }
}
