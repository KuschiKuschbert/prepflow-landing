/**
 * Auto-sync configuration helpers.
 */
import { logger } from '@/lib/logger';
import { getSquareConfig } from '../../config';
import { isSquarePOSEnabled } from '../../feature-flags';

export interface AutoSyncConfig {
  enabled: boolean;
  direction: 'prepflow_to_square' | 'bidirectional';
  syncStaff: boolean;
  syncDishes: boolean;
  syncCosts: boolean;
  debounceMs: number;
}

/**
 * Check if auto-sync should be performed for a user
 */
export async function shouldAutoSync(userId: string): Promise<boolean> {
  try {
    // Check feature flag
    const isEnabled = await isSquarePOSEnabled(userId);
    if (!isEnabled) {
      return false;
    }

    // Check user configuration
    const config = await getSquareConfig(userId);
    if (!config) {
      return false;
    }

    return config.auto_sync_enabled === true;
  } catch (error: unknown) {
    logger.error('[Square Auto-Sync] Error checking auto-sync status:', {
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    return false;
  }
}

/**
 * Get auto-sync configuration for a user
 */
export async function getAutoSyncConfig(userId: string): Promise<AutoSyncConfig | null> {
  try {
    const config = await getSquareConfig(userId);
    if (!config) {
      return null;
    }

    return {
      enabled: config.auto_sync_enabled === true,
      direction: config.auto_sync_direction || 'prepflow_to_square',
      syncStaff: config.auto_sync_staff === true,
      syncDishes: config.auto_sync_dishes === true,
      syncCosts: config.auto_sync_costs === true,
      debounceMs: config.sync_debounce_ms || 5000,
    };
  } catch (error: unknown) {
    logger.error('[Square Auto-Sync] Error getting auto-sync config:', {
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    return null;
  }
}
