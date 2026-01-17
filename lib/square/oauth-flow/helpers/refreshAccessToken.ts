/**
 * Refresh access token using refresh token.
 */
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getSquareOAuthConfig } from '../../oauth-client';
import { SQUARE_TOKEN_URL, type TokenResponse } from './constants';

/**
 * Refresh access token using refresh token.
 * Uses PrepFlow's Square Application credentials from environment variables.
 *
 * @param {string} refreshToken - Refresh token (encrypted, will be decrypted)
 * @param {'sandbox' | 'production'} environment - Square environment
 * @returns {Promise<TokenResponse>} New token response
 */
export async function refreshAccessToken(
  refreshToken: string,
  environment: 'sandbox' | 'production' = 'sandbox',
): Promise<TokenResponse> {
  const { applicationId, applicationSecret } = getSquareOAuthConfig();

  // Square uses different token URLs for sandbox vs production
  const tokenUrl =
    environment === 'production'
      ? SQUARE_TOKEN_URL.replace('connect.squareup.com', 'connect.squareup.com')
      : SQUARE_TOKEN_URL.replace('connect.squareup.com', 'connect.squareupsandbox.com');

  try {
    logger.dev('[Square OAuth] Refreshing access token...');

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2024-01-18',
      },
      body: JSON.stringify({
        client_id: applicationId,
        client_secret: applicationSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error('[Square OAuth] Token refresh failed:', {
        status: response.status,
        error: errorData,
        context: { operation: 'refresh_token' },
      });
      throw ApiErrorHandler.createError(
        errorData.message || 'Failed to refresh access token',
        'TOKEN_REFRESH_FAILED',
        response.status,
      );
    }

    const tokenData: TokenResponse = await response.json();

    if (!tokenData.access_token) {
      throw ApiErrorHandler.createError(
        'No access token in refresh response',
        'INVALID_TOKEN_RESPONSE',
        500,
      );
    }

    logger.dev('[Square OAuth] Successfully refreshed access token');

    return tokenData;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[Square OAuth] Error refreshing token:', {
      error: errorMessage,
      context: { operation: 'refresh_token' },
    });
    throw error;
  }
}
