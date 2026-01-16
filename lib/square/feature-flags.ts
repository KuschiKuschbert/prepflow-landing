/**
 * Square POS feature flag integration.
 * Wraps existing feature flag system for Square-specific checks.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Setup & Configuration section) for
 * feature flag setup and enabling instructions.
 */

import { isFeatureEnabled } from '@/lib/feature-flags';
import { logger } from '@/lib/logger';

const SQUARE_POS_FLAG_KEY = 'square_pos_integration';

/**
 * Check if Square POS integration is enabled for a user.
 *
 * @param {string} [userId] - Optional user ID for user-specific flags
 * @param {string} [userEmail] - Optional user email for admin check
 * @returns {Promise<boolean>} True if Square POS is enabled
 */
export async function isSquarePOSEnabled(userId?: string, userEmail?: string): Promise<boolean> {
  try {
    return await isFeatureEnabled(SQUARE_POS_FLAG_KEY, userId, userEmail);
  } catch (error: unknown) {
    logger.error('[Square Feature Flags] Error checking Square POS flag:', {
      error: error instanceof Error ? error.message : String(error),
      userId,
      userEmail,
      context: { endpoint: 'isSquarePOSEnabled', operation: 'check_flag' },
    });
    return false;
  }
}

/**
 * Check if a specific Square feature is accessible for a user.
 * Currently all Square features are gated by the main square_pos_integration flag.
 *
 * @param {string} userId - User ID
 * @param {string} feature - Feature name (e.g., 'catalog_sync', 'staff_sync')
 * @returns {Promise<boolean>} True if feature is accessible
 */
export async function checkSquareFeatureAccess(userId: string, feature: string): Promise<boolean> {
  try {
    // For now, all Square features are gated by the main flag
    // Future: Could add feature-specific flags if needed
    const enabled = await isSquarePOSEnabled(userId);

    if (!enabled) {
      logger.dev('[Square Feature Flags] Feature access denied:', {
        userId,
        feature,
        reason: 'square_pos_integration flag disabled',
        context: { endpoint: 'checkSquareFeatureAccess', operation: 'check_access' },
      });
    }

    return enabled;
  } catch (error: unknown) {
    logger.error('[Square Feature Flags] Error checking feature access:', {
      error: error instanceof Error ? error.message : String(error),
      userId,
      feature,
      context: { endpoint: 'checkSquareFeatureAccess', operation: 'check_access' },
    });
    return false;
  }
}
