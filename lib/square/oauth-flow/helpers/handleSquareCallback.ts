/**
 * Handle Square OAuth callback and store tokens.
 */
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { verifySecureState } from '../../oauth-state';
import { saveSquareConfig } from '../../config';
import { getSquareOAuthConfig } from '../../oauth-client';
import { exchangeCodeForTokens } from './exchangeCodeForTokens';

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
  const { userId: userIdFromState, environment: environmentFromState } =
    verifySecureState(stateToken);

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
