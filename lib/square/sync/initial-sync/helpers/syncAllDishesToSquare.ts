/**
 * Sync all dishes from PrepFlow to Square.
 */
import { logger } from '@/lib/logger';
import { syncCatalogToSquare } from '../../catalog';

/**
 * Sync all dishes from PrepFlow to Square.
 */
export async function syncAllDishesToSquare(
  userId: string,
): Promise<{ synced: number; errors: number }> {
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




