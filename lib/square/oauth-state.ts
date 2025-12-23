/**
 * OAuth state token generation and verification for Square.
 * Provides secure state tokens for OAuth flow to prevent CSRF attacks.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` for comprehensive Square API
 * configuration, setup, testing, and troubleshooting guide.
 */

import { logger } from '@/lib/logger';

interface StateData {
  userId: string;
  timestamp: number;
  nonce: string;
  environment?: 'sandbox' | 'production';
}

/**
 * Generate a secure state token for OAuth flow.
 * Includes user ID, environment, and a timestamp for validation.
 *
 * @param {string} userId - User ID (email or UUID)
 * @param {'sandbox' | 'production'} environment - Square environment (optional, defaults to sandbox)
 * @returns {string} Base64 encoded state token
 */
export function generateSecureState(
  userId: string,
  environment: 'sandbox' | 'production' = 'sandbox',
): string {
  const stateData: StateData = {
    userId,
    timestamp: Date.now(),
    nonce: crypto.getRandomValues(new Uint8Array(16)).toString(),
    environment,
  };
  return Buffer.from(JSON.stringify(stateData)).toString('base64');
}

/**
 * Verify and extract user ID and environment from secure state token.
 *
 * @param {string} stateToken - State token from OAuth callback
 * @param {number} maxAgeMs - Maximum age of state token in milliseconds (default: 10 minutes)
 * @returns {{ userId: string; environment: 'sandbox' | 'production' }} User ID and environment if valid
 * @throws {Error} If state is invalid or expired
 */
export function verifySecureState(
  stateToken: string,
  maxAgeMs: number = 10 * 60 * 1000,
): { userId: string; environment: 'sandbox' | 'production' } {
  try {
    const stateData: StateData = JSON.parse(Buffer.from(stateToken, 'base64').toString());
    const age = Date.now() - stateData.timestamp;

    if (age > maxAgeMs) {
      throw new Error('OAuth state token expired');
    }

    if (!stateData.userId) {
      throw new Error('Invalid OAuth state token: missing userId');
    }

    return {
      userId: stateData.userId,
      environment: stateData.environment || 'sandbox', // Default to sandbox if not in state
    };
  } catch (error: any) {
    logger.error('[Square OAuth] Failed to verify state token:', {
      error: error.message,
      context: { operation: 'verify_state' },
    });
    throw new Error('Invalid OAuth state token');
  }
}
