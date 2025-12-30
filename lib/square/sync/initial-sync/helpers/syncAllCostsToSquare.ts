/**
 * Sync costs for all dishes to Square.
 */
import { logger } from '@/lib/logger';
import { syncCostsToSquare } from '../../costs';

/**
 * Sync costs for all dishes to Square.
 */
export async function syncAllCostsToSquare(
  userId: string,
): Promise<{ synced: number; errors: number }> {
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



