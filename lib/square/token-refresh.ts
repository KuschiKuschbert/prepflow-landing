/**
 * Square token refresh utilities.
 * Handles automatic token refresh using stored refresh tokens.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` for comprehensive Square API
 * configuration, setup, testing, and troubleshooting guide.
 */

import { logger } from '@/lib/logger';
import { getSquareConfig, updateSquareConfig } from './config';
import { decryptSquareToken } from './token-encryption';
import { refreshAccessToken } from './oauth-flow';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Refresh Square access token if expired or about to expire.
 * Uses stored refresh token to get a new access token.
 *
 * @param {string} userId - User ID
 * @returns {Promise<string | null>} New access token or null if refresh failed
 */
export async function refreshSquareTokenIfNeeded(userId: string): Promise<string | null> {
  try {
    const config = await getSquareConfig(userId);
    if (!config) {
      logger.warn('[Square Token Refresh] No configuration found for user', { userId });
      return null;
    }

    // Check if we have a refresh token (OAuth flow)
    if (!config.refresh_token_encrypted) {
      logger.dev('[Square Token Refresh] No refresh token available - using existing access token');
      // Return existing access token (manual mode or no refresh token)
      return decryptSquareToken(config.square_access_token_encrypted);
    }

    // Decrypt refresh token
    const refreshToken = await decryptSquareToken(config.refresh_token_encrypted);

    // Refresh the access token using PrepFlow's credentials from environment
    logger.dev('[Square Token Refresh] Refreshing access token...');
    const tokenData = await refreshAccessToken(refreshToken, config.square_environment);

    // Update configuration with new access token
    // Note: Refresh token may also be updated by Square
    await updateSquareConfig(userId, {
      square_access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || refreshToken, // Use new refresh token if provided
    });

    logger.dev('[Square Token Refresh] Successfully refreshed access token');
    return tokenData.access_token;
  } catch (error: any) {
    logger.error('[Square Token Refresh] Failed to refresh token:', {
      error: error.message,
      userId,
      context: { operation: 'refresh_token' },
    });
    // Return null to indicate refresh failed - caller should handle this
    return null;
  }
}

/**
 * Get valid Square access token, refreshing if necessary.
 * This is the main function to use when you need an access token.
 *
 * @param {string} userId - User ID
 * @returns {Promise<string | null>} Valid access token or null if unavailable
 */
export async function getValidSquareToken(userId: string): Promise<string | null> {
  try {
    const config = await getSquareConfig(userId);
    if (!config) {
      return null;
    }

    // For OAuth accounts, try to refresh if we have refresh token
    if (config.refresh_token_encrypted) {
      // Try refreshing (will use existing token if refresh not needed)
      const refreshedToken = await refreshSquareTokenIfNeeded(userId);
      if (refreshedToken) {
        return refreshedToken;
      }
    }

    // Fallback to existing access token (manual mode or refresh failed)
    return decryptSquareToken(config.square_access_token_encrypted);
  } catch (error: any) {
    logger.error('[Square Token] Failed to get valid token:', {
      error: error.message,
      userId,
      context: { operation: 'get_valid_token' },
    });
    return null;
  }
}
