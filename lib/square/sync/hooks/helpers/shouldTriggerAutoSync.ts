/**
 * Check if auto-sync should be triggered for this user.
 */
import { getSquareConfig } from '../../../config';
import { isSquarePOSEnabled } from '../../../feature-flags';
import { logger } from '@/lib/logger';

/**
 * Check if auto-sync should be triggered for this user.
 */
export async function shouldTriggerAutoSync(userId: string): Promise<boolean> {
  try {
    // Check feature flag
    const isEnabled = await isSquarePOSEnabled(userId);
    if (!isEnabled) {
      return false;
    }

    // Check Square configuration
    const config = await getSquareConfig(userId);
    if (!config) {
      return false;
    }

    // Check if auto-sync is enabled
    if (!config.auto_sync_enabled) {
      return false;
    }

    return true;
  } catch (error) {
    logger.error('[Square Sync Hooks] Error checking auto-sync configuration:', {
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    return false;
  }
}
