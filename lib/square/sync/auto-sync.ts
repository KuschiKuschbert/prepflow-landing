/**
 * Auto-Sync Service
 * Coordinates automatic syncing of PrepFlow entities to Square
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Sync Operations, Automatic Sync sections) for
 * detailed auto-sync documentation and configuration examples.
 */

import { logger } from '@/lib/logger';
import { getSquareConfig } from '../config';
import { isSquarePOSEnabled } from '../feature-flags';
import { queueSyncOperation } from './auto-sync-queue';

export interface AutoSyncConfig {
  enabled: boolean;
  direction: 'prepflow_to_square' | 'bidirectional';
  syncStaff: boolean;
  syncDishes: boolean;
  syncCosts: boolean;
  debounceMs: number;
}

/**
 * Check if auto-sync should be performed for a user
 */
export async function shouldAutoSync(userId: string): Promise<boolean> {
  try {
    // Check feature flag
    const isEnabled = await isSquarePOSEnabled(userId);
    if (!isEnabled) {
      return false;
    }

    // Check user configuration
    const config = await getSquareConfig(userId);
    if (!config) {
      return false;
    }

    return config.auto_sync_enabled === true;
  } catch (error: any) {
    logger.error('[Square Auto-Sync] Error checking auto-sync status:', {
      error: error.message,
      userId,
    });
    return false;
  }
}

/**
 * Get auto-sync configuration for a user
 */
export async function getAutoSyncConfig(userId: string): Promise<AutoSyncConfig | null> {
  try {
    const config = await getSquareConfig(userId);
    if (!config) {
      return null;
    }

    return {
      enabled: config.auto_sync_enabled === true,
      direction: config.auto_sync_direction || 'prepflow_to_square',
      syncStaff: config.auto_sync_staff === true,
      syncDishes: config.auto_sync_dishes === true,
      syncCosts: config.auto_sync_costs === true,
      debounceMs: config.sync_debounce_ms || 5000,
    };
  } catch (error: any) {
    logger.error('[Square Auto-Sync] Error getting auto-sync config:', {
      error: error.message,
      userId,
    });
    return null;
  }
}

/**
 * Queue sync operation for an entity change
 * This is called by API route hooks or real-time subscriptions
 */
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

/**
 * Handle employee change (INSERT or UPDATE)
 */
export async function handleEmployeeChange(
  userId: string,
  employeeId: string,
  operation: 'create' | 'update',
): Promise<void> {
  await queueEntitySync(userId, 'employee', employeeId, operation);
}

/**
 * Handle dish change (INSERT or UPDATE)
 */
export async function handleDishChange(
  userId: string,
  dishId: string,
  operation: 'create' | 'update',
): Promise<void> {
  await queueEntitySync(userId, 'dish', dishId, operation);
}

/**
 * Handle recipe cost change (UPDATE)
 * Triggers cost sync for all dishes using this recipe
 */
export async function handleRecipeCostChange(userId: string, recipeId: string): Promise<void> {
  // Recipe cost changes affect all dishes that use this recipe
  // We'll sync costs for all dishes (cost sync service handles this)
  await queueEntitySync(userId, 'recipe', recipeId, 'update');
}

/**
 * Handle ingredient cost change (UPDATE)
 * Triggers cost sync for all dishes using this ingredient
 */
export async function handleIngredientCostChange(
  userId: string,
  ingredientId: string,
): Promise<void> {
  // Ingredient cost changes affect all dishes that use this ingredient
  // We'll sync costs for all dishes (cost sync service handles this)
  await queueEntitySync(userId, 'ingredient', ingredientId, 'update');
}
