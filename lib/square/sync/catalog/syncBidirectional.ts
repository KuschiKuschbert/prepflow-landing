/**
 * Bidirectional catalog sync.
 */
import { logger } from '@/lib/logger';
import { getSquareConfig } from '../../config';
import { syncCatalogFromSquare } from './syncFromSquare';
import { syncCatalogToSquare } from './syncToSquare';
import type { SyncResult } from '../catalog';

/**
 * Bidirectional catalog sync
 * Syncs both directions based on sync direction configuration
 */
export async function syncCatalogBidirectional(userId: string): Promise<SyncResult> {
  try {
    const config = await getSquareConfig(userId);
    if (!config) {
      logger.error('[Square Catalog Sync] Square configuration not found for bidirectional sync:', {
        userId,
      });
      return {
        success: false,
        synced: 0,
        created: 0,
        updated: 0,
        errors: 1,
        errorMessages: ['Square configuration not found'],
      };
    }

    // Default: prepflow_to_square (only direction supported in auto_sync_direction enum)
    return await syncCatalogToSquare(userId);
  } catch (error: any) {
    logger.error('[Square Catalog Sync] Bidirectional sync error:', {
      error: error.message,
      userId,
    });

    return {
      success: false,
      synced: 0,
      created: 0,
      updated: 0,
      errors: 1,
      errorMessages: [error.message],
    };
  }
}




