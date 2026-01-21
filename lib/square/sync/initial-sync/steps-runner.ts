import { logger } from '@/lib/logger';
import { syncAllCostsToSquare } from './helpers/syncAllCostsToSquare';
import { syncAllDishesToSquare } from './helpers/syncAllDishesToSquare';
import { syncAllStaffToSquare } from './helpers/syncAllStaffToSquare';
import { syncRecentOrdersFromSquareForInitialSync } from './helpers/syncRecentOrders';
import type { InitialSyncResult } from './types';

export async function runInitialSyncSteps(
  userId: string,
  result: InitialSyncResult,
): Promise<InitialSyncResult> {
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

  return result;
}
