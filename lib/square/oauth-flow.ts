/**
 * Square OAuth 2.0 flow handling.
 * Provides authorization URL generation, token exchange, and refresh logic.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` for comprehensive Square API
 * configuration, setup, testing, and troubleshooting guide.
 */

import { logger } from '@/lib/logger';
import { getDetectedBaseUrl } from '@/lib/auth0';
import { generateSecureState, verifySecureState } from './oauth-state';
import { encryptSquareToken, decryptSquareToken } from './token-encryption';
import { saveSquareConfig, getSquareConfig } from './config';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getSquareOAuthConfig } from './oauth-client';

// Square OAuth endpoints
const SQUARE_AUTH_BASE_URL = 'https://squareup.com/oauth2/authorize';
const SQUARE_TOKEN_URL = 'https://connect.squareup.com/oauth2/token';

// Required OAuth scopes for PrepFlow integration
const REQUIRED_SCOPES = [
  'ORDERS_READ', // Read orders/sales data
  'CATALOG_READ', // Read catalog items
  'CATALOG_WRITE', // Create/update catalog items
  'TEAM_READ', // Read team members/staff
  'TEAM_WRITE', // Create/update team members
];

/**
 * Get Square OAuth authorization URL.
 * Uses PrepFlow's Square Application ID from environment variables.
 *
 * @param {string} userId - User ID (email or UUID)
 * @param {'sandbox' | 'production'} environment - Square environment
 * @returns {string} Authorization URL
 */
export function getSquareAuthUrl(
  userId: string,
  environment: 'sandbox' | 'production' = 'sandbox',
): string {
  // Get PrepFlow's Square Application credentials from environment
  const { applicationId, redirectUri } = getSquareOAuthConfig();

  // Generate secure state token (includes environment)
  const stateToken = generateSecureState(userId, environment);

  // Build authorization URL with PrepFlow's Application ID
  const params = new URLSearchParams({
    client_id: applicationId, // PrepFlow's app ID
    response_type: 'code',
    scope: REQUIRED_SCOPES.join(' '),
    redirect_uri: redirectUri,
    state: stateToken,
    session: 'false', // Don't use Square session
  });

  // Square uses different base URLs for sandbox vs production
  const authUrl = environment === 'production'
    ? SQUARE_AUTH_BASE_URL.replace('squareup.com', 'squareup.com')
    : SQUARE_AUTH_BASE_URL.replace('squareup.com', 'squareupsandbox.com');

  return `${authUrl}?${params.toString()}`;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_at?: string;
  merchant_id: string;
  refresh_token?: string;
  short_lived?: boolean;
}

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
  // Get PrepFlow's Square Application credentials from environment
  const { applicationId, applicationSecret, redirectUri } = getSquareOAuthConfig();

  // Square uses different token URLs for sandbox vs production
  const tokenUrl = environment === 'production'
    ? SQUARE_TOKEN_URL.replace('connect.squareup.com', 'connect.squareup.com')
    : SQUARE_TOKEN_URL.replace('connect.squareup.com', 'connect.squareupsandbox.com');

  try {
    logger.dev('[Square OAuth] Exchanging authorization code for tokens...');

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2024-01-18', // Use latest Square API version
      },
      body: JSON.stringify({
        client_id: applicationId, // PrepFlow's app ID
        client_secret: applicationSecret, // PrepFlow's app secret
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
      throw ApiErrorHandler.createError('No access token in response', 'INVALID_TOKEN_RESPONSE', 500);
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
  // Get PrepFlow's Square Application credentials from environment
  const { applicationId, applicationSecret } = getSquareOAuthConfig();

  // Square uses different token URLs for sandbox vs production
  const tokenUrl = environment === 'production'
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
        client_id: applicationId, // PrepFlow's app ID
        client_secret: applicationSecret, // PrepFlow's app secret
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
      throw ApiErrorHandler.createError('No access token in refresh response', 'INVALID_TOKEN_RESPONSE', 500);
    }

    logger.dev('[Square OAuth] Successfully refreshed access token');

    return tokenData;
  } catch (error: any) {
    logger.error('[Square OAuth] Error refreshing token:', {
      error: error.message,
      context: { operation: 'refresh_token' },
    });
    throw error;
  }
}

/**
 * Handle Square OAuth callback and store tokens.
 * Uses PrepFlow's Square Application credentials from environment variables.
 * User's access token is for their own Square account (not PrepFlow's account).
 *
 * @param {string} code - Authorization code from OAuth callback
 * @param {string} stateToken - Secure state token from OAuth callback
 * @param {string} expectedUserId - Expected user ID from authenticated session (for verification)
 * @param {'sandbox' | 'production'} environment - Square environment
 * @returns {Promise<void>}
 */
export async function handleSquareCallback(
  code: string,
  stateToken: string,
  expectedUserId: string,
  environment?: 'sandbox' | 'production',
): Promise<void> {
  // Verify state token and extract user ID and environment
  const { userId: userIdFromState, environment: environmentFromState } = verifySecureState(stateToken);

  // Use environment from state token if provided, otherwise use parameter (fallback to sandbox)
  const finalEnvironment = environment || environmentFromState || 'sandbox';

  // Security check: Ensure state token matches authenticated user
  if (userIdFromState !== expectedUserId) {
    logger.error('[Square OAuth] State token mismatch:', {
      expected: expectedUserId,
      got: userIdFromState,
      context: { operation: 'verify_state' },
    });
    throw ApiErrorHandler.createError(
      'OAuth state verification failed. User ID mismatch.',
      'STATE_MISMATCH',
      403,
    );
  }

  // Get PrepFlow's Square Application credentials from environment
  const { applicationId } = getSquareOAuthConfig();

  // Exchange code for tokens using PrepFlow's credentials
  // This gets an access token for the USER's Square account (not PrepFlow's account)
  const tokenData = await exchangeCodeForTokens(code, finalEnvironment);

  if (!tokenData.refresh_token) {
    logger.warn('[Square OAuth] No refresh token received - token may be short-lived');
  }

  // Store configuration with encrypted tokens
  // Note: square_application_id stores PrepFlow's app ID for reference
  // square_access_token is the user's token for their own Square account
  await saveSquareConfig(expectedUserId, {
    square_application_id: applicationId, // PrepFlow's app ID (for reference)
    square_access_token: tokenData.access_token, // User's access token (for their account) - will be encrypted
    refresh_token: tokenData.refresh_token || undefined, // User's refresh token - will be encrypted if present
    square_environment: finalEnvironment,
  });

  logger.info(`[Square OAuth] Successfully connected Square account for user ${expectedUserId}`);
}
