/**
 * Square OAuth 2.0 flow handling.
 * Provides authorization URL generation, token exchange, and refresh logic.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` for comprehensive Square API
 * configuration, setup, testing, and troubleshooting guide.
 */

import { generateSecureState } from './oauth-state';
import { getSquareOAuthConfig } from './oauth-client';
import { SQUARE_AUTH_BASE_URL, REQUIRED_SCOPES } from './oauth-flow/helpers/constants';
import { exchangeCodeForTokens } from './oauth-flow/helpers/exchangeCodeForTokens';
import { refreshAccessToken } from './oauth-flow/helpers/refreshAccessToken';
import { handleSquareCallback } from './oauth-flow/helpers/handleSquareCallback';

// Re-export for backward compatibility
export { exchangeCodeForTokens, refreshAccessToken, handleSquareCallback };
export type { TokenResponse } from './oauth-flow/helpers/constants';

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
  const authUrl =
    environment === 'production'
      ? SQUARE_AUTH_BASE_URL.replace('squareup.com', 'squareup.com')
      : SQUARE_AUTH_BASE_URL.replace('squareup.com', 'squareupsandbox.com');

  return `${authUrl}?${params.toString()}`;
}
