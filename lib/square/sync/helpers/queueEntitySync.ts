/**
 * Queue sync operation for an entity change.
 * This is called by API route hooks or real-time subscriptions
 */
import { logger } from '@/lib/logger';
import { queueSyncOperation } from '../auto-sync-queue';
import { shouldAutoSync, getAutoSyncConfig } from './autoSyncConfig';

export async function queueEntitySync(
  userId: string,
  entityType: 'dish' | 'employee' | 'recipe' | 'ingredient',
  entityId: string,
  operation: 'create' | 'update' | 'delete',
): Promise<void> {
  try {
    // Check if auto-sync is enabled
    const shouldSync = await shouldAutoSync(userId);
    if (!shouldSync) {
      logger.dev('[Square Auto-Sync] Auto-sync disabled, skipping:', {
        userId,
        entityType,
        entityId,
      });
      return;
    }

    // Get auto-sync configuration
    const config = await getAutoSyncConfig(userId);
    if (!config) {
      return;
    }

    // Check if this entity type should be synced
    if (entityType === 'employee' && !config.syncStaff) {
      return;
    }
    if (entityType === 'dish' && !config.syncDishes) {
      return;
    }
    if ((entityType === 'recipe' || entityType === 'ingredient') && !config.syncCosts) {
      return;
    }

    // Determine sync direction
    const direction = config.direction === 'bidirectional' ? 'bidirectional' : 'prepflow_to_square';

    // Determine priority
    let priority: 'high' | 'normal' | 'low' = 'normal';
    if (operation === 'create') {
      priority = 'high'; // New entities should sync immediately
    } else if (operation === 'delete') {
      priority = 'high'; // Deletions are important
    }

    // Queue sync operation
    await queueSyncOperation({
      user_id: userId,
      entity_type: entityType,
      entity_id: entityId,
      operation,
      direction,
      priority,
    });

    logger.dev('[Square Auto-Sync] Queued sync operation:', {
      userId,
      entityType,
      entityId,
      operation,
      direction,
      priority,
    });
  } catch (error: any) {
    logger.error('[Square Auto-Sync] Error queueing sync:', {
      error: error.message,
      userId,
      entityType,
      entityId,
      stack: error.stack,
    });
    // Don't throw - auto-sync failures shouldn't break main operations
  }
}
