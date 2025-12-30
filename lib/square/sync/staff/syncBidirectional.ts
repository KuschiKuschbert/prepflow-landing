/**
 * Bidirectional staff sync.
 */
import { logger } from '@/lib/logger';
import { getSquareConfig } from '../../config';
import { syncStaffFromSquare } from './syncFromSquare';
import { syncStaffToSquare } from './syncToSquare';
import type { SyncResult } from '../staff';

/**
 * Bidirectional staff sync
 * Syncs both directions based on sync direction configuration
 */
export async function syncStaffBidirectional(userId: string): Promise<SyncResult> {
  try {
    const config = await getSquareConfig(userId);
    if (!config) {
      logger.error('[Square Staff Sync] Square configuration not found for bidirectional sync:', {
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

    const syncDirection = config.auto_sync_direction || 'prepflow_to_square';

    if (syncDirection === 'bidirectional') {
      // Sync both directions
      const fromSquareResult = await syncStaffFromSquare(userId);
      const toSquareResult = await syncStaffToSquare(userId);

      return {
        success: fromSquareResult.success && toSquareResult.success,
        synced: fromSquareResult.synced + toSquareResult.synced,
        created: fromSquareResult.created + toSquareResult.created,
        updated: fromSquareResult.updated + toSquareResult.updated,
        errors: fromSquareResult.errors + toSquareResult.errors,
        errorMessages: [
          ...(fromSquareResult.errorMessages || []),
          ...(toSquareResult.errorMessages || []),
        ],
      };
    } else {
      // Default: prepflow_to_square (only direction supported in auto_sync_direction enum)
      return await syncStaffToSquare(userId);
    }
  } catch (error: any) {
    logger.error('[Square Staff Sync] Bidirectional sync error:', {
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




