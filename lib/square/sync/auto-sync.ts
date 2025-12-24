/**
 * Auto-Sync Service
 * Coordinates automatic syncing of PrepFlow entities to Square
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Sync Operations, Automatic Sync sections) for
 * detailed auto-sync documentation and configuration examples.
 */

import { queueEntitySync as queueEntitySyncHelper } from './helpers/queueEntitySync';
import { shouldAutoSync, getAutoSyncConfig, type AutoSyncConfig } from './helpers/autoSyncConfig';

export type { AutoSyncConfig };
export { shouldAutoSync, getAutoSyncConfig };

/**
 * Queue sync operation for an entity change.
 * Re-exported from helper for backward compatibility.
 */
export { queueEntitySyncHelper as queueEntitySync };

/**
 * Handle employee change (INSERT or UPDATE)
 */
export async function handleEmployeeChange(
  userId: string,
  employeeId: string,
  operation: 'create' | 'update',
): Promise<void> {
  await queueEntitySyncHelper(userId, 'employee', employeeId, operation);
}

/**
 * Handle dish change (INSERT or UPDATE)
 */
export async function handleDishChange(
  userId: string,
  dishId: string,
  operation: 'create' | 'update',
): Promise<void> {
  await queueEntitySyncHelper(userId, 'dish', dishId, operation);
}

/**
 * Handle recipe cost change (UPDATE)
 * Triggers cost sync for all dishes using this recipe
 */
export async function handleRecipeCostChange(userId: string, recipeId: string): Promise<void> {
  // Recipe cost changes affect all dishes that use this recipe
  // We'll sync costs for all dishes (cost sync service handles this)
  await queueEntitySyncHelper(userId, 'recipe', recipeId, 'update');
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
  await queueEntitySyncHelper(userId, 'ingredient', ingredientId, 'update');
}
