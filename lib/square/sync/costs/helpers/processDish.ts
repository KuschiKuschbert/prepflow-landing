/**
 * Process a single dish for cost sync.
 */
import { logger } from '@/lib/logger';
import { SquareClient } from 'square';
import type { SyncResult } from '../../costs';
import { calculateDishFoodCost } from './calculateCost';
import { logCostSyncOperation } from './common';
import { updateSquareItemCosts } from './updateSquareItem';

/**
 * Process a single dish for cost sync
 */
export async function processDishCostSync(
  dish: { id: string; square_mappings?: { square_id?: string }[] },
  client: SquareClient,
  userId: string,
  result: SyncResult,
): Promise<void> {
  try {
    const mapping = dish.square_mappings?.[0];

    if (!mapping || !mapping.square_id) {
      logger.warn('[Square Cost Sync] No Square mapping found for dish:', {
        dishId: dish.id,
      });
      return;
    }

    // Calculate food cost
    const costData = await calculateDishFoodCost(dish.id);

    if (!costData) {
      logger.error('[Square Cost Sync] Failed to calculate cost for dish:', {
        dishId: dish.id,
      });
      result.errors++;
      result.errorMessages?.push(`Failed to calculate cost for dish ${dish.id}`);
      return;
    }

    // Update Square catalog item with cost data
    const updateSuccess = await updateSquareItemCosts(client, mapping.square_id, costData);

    if (!updateSuccess) {
      logger.error('[Square Cost Sync] Failed to update Square item costs:', {
        dishId: dish.id,
        squareItemId: mapping.square_id,
      });
      result.errors++;
      result.errorMessages?.push(`Failed to update Square item costs for dish ${dish.id}`);
      return;
    }

    // Log sync operation
    await logCostSyncOperation({
      userId,
      entityId: dish.id,
      squareId: mapping.square_id,
      status: 'success',
      costData: {
        total_cost: costData.total_cost,
        food_cost_percent: costData.food_cost_percent,
      },
    });

    result.updated++;
    result.synced++;
  } catch (dishError: unknown) {
    logger.error('[Square Cost Sync] Error processing dish:', {
      error: dishError instanceof Error ? dishError.message : String(dishError),
      dishId: dish.id,
    });
    result.errors++;
    result.errorMessages?.push(`Failed to process dish ${dish.id}: ${dishError instanceof Error ? dishError.message : String(dishError)}`);

    await logCostSyncOperation({
      userId,
      entityId: dish.id,
      status: 'error',
      errorMessage: dishError instanceof Error ? dishError.message : String(dishError),
      errorDetails: { stack: dishError instanceof Error ? dishError.stack : undefined },
    });
  }
}
