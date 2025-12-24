/**
 * Exchange authorization code for access token and refresh token.
 */
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getSquareOAuthConfig } from '../../oauth-client';
import { SQUARE_TOKEN_URL, type TokenResponse } from './constants';

/**
 * Exchange authorization code for access token and refresh token.
 * Uses PrepFlow's Square Application credentials from environment variables.
 *
 * @param {string} code - Authorization code from OAuth callback
 * @param {'sandbox' | 'production'} environment - Square environment
 * @returns {Promise<TokenResponse>} Token response with access_token and refresh_token
 */
export async function exchangeCodeForTokens(
  code: string,
  environment: 'sandbox' | 'production' = 'sandbox',
): Promise<TokenResponse> {
  const { applicationId, applicationSecret, redirectUri } = getSquareOAuthConfig();

  // Square uses different token URLs for sandbox vs production
  const tokenUrl =
    environment === 'production'
      ? SQUARE_TOKEN_URL.replace('connect.squareup.com', 'connect.squareup.com')
      : SQUARE_TOKEN_URL.replace('connect.squareup.com', 'connect.squareupsandbox.com');

  try {
    logger.dev('[Square OAuth] Exchanging authorization code for tokens...');

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2024-01-18',
      },
      body: JSON.stringify({
        client_id: applicationId,
        client_secret: applicationSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error('[Square OAuth] Token exchange failed:', {
        status: response.status,
        error: errorData,
        context: { operation: 'exchange_code' },
      });
      throw ApiErrorHandler.createError(
        errorData.message || 'Failed to exchange authorization code',
        'TOKEN_EXCHANGE_FAILED',
        response.status,
      );
    }

    const tokenData: TokenResponse = await response.json();

    if (!tokenData.access_token) {
      throw ApiErrorHandler.createError(
        'No access token in response',
        'INVALID_TOKEN_RESPONSE',
        500,
      );
    }

    logger.dev('[Square OAuth] Successfully exchanged code for tokens');

    return tokenData;
  } catch (error: any) {
    logger.error('[Square OAuth] Error exchanging code:', {
      error: error.message,
      context: { operation: 'exchange_code' },
    });
    throw error;
  }
}
