/**
 * Trigger Square cost sync for a dish after recipe/ingredient changes.
 */
import { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
import { getUserIdFromRequest } from './helpers/getUserIdFromRequest';
import { shouldTriggerAutoSync } from './helpers/shouldTriggerAutoSync';
import { getSquareConfig } from '../../config';
import { queueSyncOperation } from '../auto-sync-queue';

/**
 * Trigger Square cost sync for a dish after recipe/ingredient changes
 * This is called when recipes or ingredients are updated, which affects dish costs
 */
export async function triggerCostSync(
  req: NextRequest,
  dishId: string,
  reason: 'recipe_updated' | 'ingredient_updated' | 'dish_updated',
): Promise<void> {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      logger.dev('[Square Sync Hooks] No user ID, skipping cost sync');
      return;
    }

    const shouldSync = await shouldTriggerAutoSync(userId);
    if (!shouldSync) {
      logger.dev('[Square Sync Hooks] Auto-sync disabled, skipping cost sync');
      return;
    }

    const config = await getSquareConfig(userId);
    if (!config?.auto_sync_costs) {
      logger.dev('[Square Sync Hooks] Cost auto-sync disabled, skipping');
      return;
    }

    // Queue cost sync operation (costs always go PrepFlow → Square)
    await queueSyncOperation({
      user_id: userId,
      entity_type: 'dish', // Cost sync uses dish entity type
      entity_id: dishId,
      operation: 'update', // Cost updates are treated as updates
      direction: 'prepflow_to_square',
      priority: 'normal',
    });

    logger.dev(`[Square Sync Hooks] Queued cost sync for dish: ${dishId} (reason: ${reason})`);
  } catch (error) {
    // Don't throw - sync failures shouldn't break the main operation
    logger.error('[Square Sync Hooks] Error triggering cost sync:', {
      error: error instanceof Error ? error.message : String(error),
      dishId,
      reason,
    });
  }
}
