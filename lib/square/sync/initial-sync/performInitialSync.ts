/**
 * Perform initial sync of all PrepFlow data to Square.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { SquareConfig } from '../../config';
import { logSyncOperation } from '../../sync-log';
import { logInitialSyncCompletion } from './helpers/logSyncCompletion';
import { syncAllCostsToSquare } from './helpers/syncAllCostsToSquare';
import { syncAllDishesToSquare } from './helpers/syncAllDishesToSquare';
import { syncAllStaffToSquare } from './helpers/syncAllStaffToSquare';
import { syncRecentOrdersFromSquareForInitialSync } from './helpers/syncRecentOrders';
import {
  markInitialSyncCompleted,
  markInitialSyncFailed,
  markInitialSyncStarted,
} from './helpers/updateSyncStatus';
import type { InitialSyncResult } from './types';

/**
 * Perform initial sync of all PrepFlow data to Square
 * This is called automatically when Square is first connected
 */
export async function performInitialSync(
  userId: string,
  _config: SquareConfig,
): Promise<InitialSyncResult> {
  const startedAt = new Date().toISOString();
  const result: InitialSyncResult = {
    success: false,
    staffSynced: 0,
    dishesSynced: 0,
    ordersSynced: 0,
    costsSynced: 0,
    errors: 0,
    errorMessages: [],
    startedAt,
  };

  if (!supabaseAdmin) {
    result.errorMessages?.push('Database connection not available');
    return result;
  }

  try {
    // Update config to mark initial sync as started
    await markInitialSyncStarted(userId, startedAt);

    logger.dev('[Square Initial Sync] Starting initial sync:', {
      userId,
      startedAt,
    });

    // Step 1: Sync all staff/employees (PrepFlow → Square)
    logger.dev('[Square Initial Sync] Step 1: Syncing staff...');
    const staffResult = await syncAllStaffToSquare(userId);
    result.staffSynced = staffResult.synced;
    result.errors += staffResult.errors;

    if (staffResult.errors > 0) {
      result.errorMessages?.push(`Staff sync: ${staffResult.errors} error(s)`);
    }

    // Step 2: Sync all dishes/menu items (PrepFlow → Square)
    logger.dev('[Square Initial Sync] Step 2: Syncing dishes...');
    const dishesResult = await syncAllDishesToSquare(userId);
    result.dishesSynced = dishesResult.synced;
    result.errors += dishesResult.errors;

    if (dishesResult.errors > 0) {
      result.errorMessages?.push(`Dishes sync: ${dishesResult.errors} error(s)`);
    }

    // Step 3: Sync recent sales data (Square → PrepFlow, last 30 days)
    logger.dev('[Square Initial Sync] Step 3: Syncing recent orders...');
    const ordersResult = await syncRecentOrdersFromSquareForInitialSync(userId, 30);
    result.ordersSynced = ordersResult.synced;
    result.errors += ordersResult.errors;

    if (ordersResult.errors > 0) {
      result.errorMessages?.push(`Orders sync: ${ordersResult.errors} error(s)`);
    }

    // Step 4: Sync costs for all dishes (PrepFlow → Square)
    logger.dev('[Square Initial Sync] Step 4: Syncing costs...');
    const costsResult = await syncAllCostsToSquare(userId);
    result.costsSynced = costsResult.synced;
    result.errors += costsResult.errors;

    if (costsResult.errors > 0) {
      result.errorMessages?.push(`Costs sync: ${costsResult.errors} error(s)`);
    }

    // Mark initial sync as completed
    const completedAt = new Date().toISOString();
    result.completedAt = completedAt;
    result.success = result.errors === 0;

    await markInitialSyncCompleted(result, userId);

    // Log initial sync completion
    await logInitialSyncCompletion(result, userId);

    logger.dev('[Square Initial Sync] Initial sync completed:', {
      userId,
      success: result.success,
      staffSynced: result.staffSynced,
      dishesSynced: result.dishesSynced,
      ordersSynced: result.ordersSynced,
      costsSynced: result.costsSynced,
      errors: result.errors,
    });

    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    const completedAt = new Date().toISOString();
    result.completedAt = completedAt;
    result.errors++;
    result.errorMessages?.push(`Fatal error: ${errorMessage}`);

    logger.error('[Square Initial Sync] Fatal error during initial sync:', {
      error: errorMessage,
      userId,
      stack: errorStack,
    });

    // Mark initial sync as failed
    await markInitialSyncFailed(userId, errorMessage, completedAt);

    // Log fatal error
    await logSyncOperation({
      user_id: userId,
      operation_type: 'initial_sync',
      direction: 'bidirectional',
      status: 'error',
      error_message: errorMessage,
      error_details: { stack: errorStack },
    });

    return result;
  }
}
