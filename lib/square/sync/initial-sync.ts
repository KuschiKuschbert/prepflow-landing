/**
 * Initial Sync Service
 * Automatically syncs all existing PrepFlow data to Square when Square is first connected
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Sync Operations section) for
 * detailed initial sync documentation and usage examples.
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getSquareConfig, SquareConfig } from '../config';
import { syncCatalogToSquare } from './catalog';
import { syncRecentOrdersFromSquare } from './orders';
import { syncStaffToSquare } from './staff';
import { syncCostsToSquare } from './costs';
import { logSyncOperation } from '../sync-log';

export interface InitialSyncResult {
  success: boolean;
  staffSynced: number;
  dishesSynced: number;
  ordersSynced: number;
  costsSynced: number;
  errors: number;
  errorMessages?: string[];
  startedAt: string;
  completedAt?: string;
}

/**
 * Check if initial sync should be performed
 * Returns true if no mappings exist for the user (first connection)
 */
export async function shouldPerformInitialSync(userId: string): Promise<boolean> {
  try {
    if (!supabaseAdmin) {
      return false;
    }

    // Check if any mappings exist for this user
    const { data, error } = await supabaseAdmin
      .from('square_mappings')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is what we want for initial sync
      logger.error('[Square Initial Sync] Error checking for existing mappings:', {
        error: error.message,
        userId,
      });
      return false;
    }

    // If no mappings exist, initial sync should be performed
    return !data;
  } catch (error: any) {
    logger.error('[Square Initial Sync] Unexpected error checking initial sync status:', {
      error: error.message,
      userId,
    });
    return false;
  }
}

/**
 * Sync all staff/employees from PrepFlow to Square
 */
async function syncAllStaffToSquare(userId: string): Promise<{ synced: number; errors: number }> {
  try {
    const result = await syncStaffToSquare(userId);
    return {
      synced: result.synced,
      errors: result.errors,
    };
  } catch (error: any) {
    logger.error('[Square Initial Sync] Error syncing staff:', {
      error: error.message,
      userId,
    });
    return { synced: 0, errors: 1 };
  }
}

/**
 * Sync all dishes from PrepFlow to Square
 */
async function syncAllDishesToSquare(userId: string): Promise<{ synced: number; errors: number }> {
  try {
    const result = await syncCatalogToSquare(userId);
    return {
      synced: result.synced,
      errors: result.errors,
    };
  } catch (error: any) {
    logger.error('[Square Initial Sync] Error syncing dishes:', {
      error: error.message,
      userId,
    });
    return { synced: 0, errors: 1 };
  }
}

/**
 * Sync recent orders from Square to PrepFlow
 */
async function syncRecentOrdersFromSquareForInitialSync(
  userId: string,
  days: number = 30,
): Promise<{ synced: number; errors: number }> {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await syncRecentOrdersFromSquare(userId);
    return {
      synced: result.synced,
      errors: result.errors,
    };
  } catch (error: any) {
    logger.error('[Square Initial Sync] Error syncing orders:', {
      error: error.message,
      userId,
    });
    return { synced: 0, errors: 1 };
  }
}

/**
 * Sync costs for all dishes to Square
 */
async function syncAllCostsToSquare(userId: string): Promise<{ synced: number; errors: number }> {
  try {
    const result = await syncCostsToSquare(userId);
    return {
      synced: result.synced,
      errors: result.errors,
    };
  } catch (error: any) {
    logger.error('[Square Initial Sync] Error syncing costs:', {
      error: error.message,
      userId,
    });
    return { synced: 0, errors: 1 };
  }
}

/**
 * Perform initial sync of all PrepFlow data to Square
 * This is called automatically when Square is first connected
 */
export async function performInitialSync(
  userId: string,
  config: SquareConfig,
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

  try {
    // Update config to mark initial sync as started
    await supabaseAdmin
      .from('square_configurations')
      .update({
        initial_sync_status: 'in_progress',
        initial_sync_started_at: startedAt,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

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

    await supabaseAdmin
      .from('square_configurations')
      .update({
        initial_sync_completed: true,
        initial_sync_completed_at: completedAt,
        initial_sync_status: result.success ? 'completed' : 'failed',
        initial_sync_error: result.errors > 0 ? result.errorMessages?.join('; ') : null,
        updated_at: completedAt,
      })
      .eq('user_id', userId);

    // Log initial sync completion
    await logSyncOperation({
      user_id: userId,
      operation_type: 'initial_sync',
      direction: 'bidirectional',
      status: result.success ? 'success' : 'error',
      error_message: result.errors > 0 ? result.errorMessages?.join('; ') : undefined,
      sync_metadata: {
        staffSynced: result.staffSynced,
        dishesSynced: result.dishesSynced,
        ordersSynced: result.ordersSynced,
        costsSynced: result.costsSynced,
        totalErrors: result.errors,
        startedAt: result.startedAt,
        completedAt: result.completedAt,
      },
    });

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
  } catch (error: any) {
    const completedAt = new Date().toISOString();
    result.completedAt = completedAt;
    result.errors++;
    result.errorMessages?.push(`Fatal error: ${error.message}`);

    logger.error('[Square Initial Sync] Fatal error during initial sync:', {
      error: error.message,
      userId,
      stack: error.stack,
    });

    // Mark initial sync as failed
    await supabaseAdmin
      .from('square_configurations')
      .update({
        initial_sync_completed: false,
        initial_sync_completed_at: completedAt,
        initial_sync_status: 'failed',
        initial_sync_error: error.message,
        updated_at: completedAt,
      })
      .eq('user_id', userId);

    // Log fatal error
    await logSyncOperation({
      user_id: userId,
      operation_type: 'initial_sync',
      direction: 'bidirectional',
      status: 'error',
      error_message: error.message,
      error_details: { stack: error.stack },
    });

    return result;
  }
}
