/**
 * Square OAuth2 client configuration.
 * PrepFlow has ONE Square Application that all users connect through.
 * Users authorize PrepFlow's app to access their own Square accounts.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` for comprehensive Square API
 * configuration, setup, testing, and troubleshooting guide.
 */

import { getDetectedBaseUrl } from '@/lib/auth0';

const SQUARE_APPLICATION_ID = process.env.SQUARE_APPLICATION_ID;
const SQUARE_APPLICATION_SECRET = process.env.SQUARE_APPLICATION_SECRET;

/**
 * Get Square OAuth configuration from environment variables.
 * PrepFlow uses ONE Square Application for all users.
 *
 * @returns {Object} OAuth configuration with applicationId, applicationSecret, and redirectUri
 * @throws {Error} If Square OAuth is not configured
 */
export function getSquareOAuthConfig() {
  if (!SQUARE_APPLICATION_ID || !SQUARE_APPLICATION_SECRET) {
    throw new Error(
      'Square OAuth not configured. Please set SQUARE_APPLICATION_ID and SQUARE_APPLICATION_SECRET environment variables.',
    );
  }

  const baseUrl = getDetectedBaseUrl();
  const redirectUri = `${baseUrl}/api/square/callback`;

  return {
    applicationId: SQUARE_APPLICATION_ID,
    applicationSecret: SQUARE_APPLICATION_SECRET,
    redirectUri,
  };
}
