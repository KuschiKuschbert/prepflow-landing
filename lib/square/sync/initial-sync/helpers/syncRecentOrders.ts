/**
 * Sync recent orders from Square to PrepFlow.
 */
import { logger } from '@/lib/logger';
import { syncRecentOrdersFromSquare } from '../../orders';

/**
 * Sync recent orders from Square to PrepFlow.
 */
export async function syncRecentOrdersFromSquareForInitialSync(
  userId: string,
  days: number = 30,
): Promise<{ synced: number; errors: number }> {
  try {
    const result = await syncRecentOrdersFromSquare(userId, days);
    return {
      synced: result.synced,
      errors: result.errors,
    };
  } catch (error: unknown) {
    logger.error('[Square Initial Sync] Error syncing orders:', {
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    return { synced: 0, errors: 1 };
  }
}
