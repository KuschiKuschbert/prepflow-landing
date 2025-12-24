/**
 * Trigger Square sync for a dish after create/update.
 */
import { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
import { getUserIdFromRequest } from './helpers/getUserIdFromRequest';
import { shouldTriggerAutoSync } from './helpers/shouldTriggerAutoSync';
import { getSquareConfig } from '../../config';
import { queueSyncOperation } from '../auto-sync-queue';

/**
 * Trigger Square sync for a dish after create/update.
 */
export async function triggerDishSync(
  req: NextRequest,
  dishId: string,
  operation: 'create' | 'update',
): Promise<void> {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      logger.dev('[Square Sync Hooks] No user ID, skipping dish sync');
      return;
    }

    const shouldSync = await shouldTriggerAutoSync(userId);
    if (!shouldSync) {
      logger.dev('[Square Sync Hooks] Auto-sync disabled, skipping dish sync');
      return;
    }

    const config = await getSquareConfig(userId);
    if (!config?.auto_sync_dishes) {
      logger.dev('[Square Sync Hooks] Dish auto-sync disabled, skipping');
      return;
    }

    // Queue sync operation
    await queueSyncOperation({
      user_id: userId,
      entity_type: 'dish',
      entity_id: dishId,
      operation,
      direction:
        config.auto_sync_direction === 'bidirectional' ? 'bidirectional' : 'prepflow_to_square',
      priority: 'normal',
    });

    logger.dev(`[Square Sync Hooks] Queued ${operation} sync for dish: ${dishId}`);
  } catch (error) {
    // Don't throw - sync failures shouldn't break the main operation
    logger.error('[Square Sync Hooks] Error triggering dish sync:', {
      error: error instanceof Error ? error.message : String(error),
      dishId,
    });
  }
}
