/**
 * Process PrepFlow dishes for sync to Square.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getMappingByPrepFlowId } from '../../../mappings';
import type { Dish, SyncResult } from '../../catalog';
import { logCatalogSyncOperation } from './common';
import { mapDishToSquareItem } from './mapping';
import { createSquareCatalogItem } from './processor/create';
import type { CatalogApi } from './processor/types';
import { updateSquareCatalogItem } from './processor/update';

export type { CatalogApi };

/**
 * Process a single PrepFlow dish for sync to Square
 */
export async function processPrepFlowDish(
  dish: Dish,
  userId: string,
  locationId: string,
  catalogApi: CatalogApi,
  result: SyncResult,
): Promise<void> {
  if (!supabaseAdmin) {
    result.errorMessages?.push('Database connection not available');
    return;
  }

  try {
    // Check if mapping exists
    const mapping = await getMappingByPrepFlowId(dish.id, 'dish', userId);

    // Map PrepFlow dish to Square catalog item
    const squareItemDataResponse = mapDishToSquareItem(dish);

    if (!squareItemDataResponse.itemData) {
      throw new Error('Mapped dish is missing itemData');
    }

    const squareItemData = {
      id: squareItemDataResponse.id,
      itemData: squareItemDataResponse.itemData,
    };

    if (mapping) {
      await updateSquareCatalogItem(userId, dish, mapping, squareItemData, catalogApi, result);
    } else {
      await createSquareCatalogItem(userId, locationId, dish, squareItemData, catalogApi, result);
    }
  } catch (dishError: unknown) {
    const dishErrorMessage = dishError instanceof Error ? dishError.message : String(dishError);
    const dishErrorStack = dishError instanceof Error ? dishError.stack : undefined;
    logger.error('[Square Catalog Sync] Error processing dish:', {
      error: dishErrorMessage,
      dishId: dish.id,
    });
    result.errors++;
    result.errorMessages?.push(`Failed to process dish ${dish.id}: ${dishErrorMessage}`);

    await logCatalogSyncOperation({
      userId,
      direction: 'prepflow_to_square',
      entityId: dish.id,
      status: 'error',
      errorMessage: dishErrorMessage,
      errorDetails: { stack: dishErrorStack },
    });
  }
}
