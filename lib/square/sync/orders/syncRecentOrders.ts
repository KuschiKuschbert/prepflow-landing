/**
 * Sync recent orders from Square.
 */
import { syncOrdersFromSquare } from './syncOrdersFromSquare';
import type { SyncResult } from './types';

/**
 * Sync recent orders from Square
 * Convenience function for regular sync operations
 */
export async function syncRecentOrdersFromSquare(
  userId: string,
  days?: number,
  locationId?: string,
): Promise<SyncResult> {
  const daysToSync = days || 30;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysToSync);

  return syncOrdersFromSquare(
    userId,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0],
    locationId,
  );
}


