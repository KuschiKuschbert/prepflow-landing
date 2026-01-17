/**
 * Process PrepFlow dishes for sync to Square.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { SquareClient } from 'square';
import { createAutoMapping, getMappingByPrepFlowId } from '../../../mappings';
import type { Dish, SyncResult } from '../../catalog';
import { logCatalogSyncOperation } from './common';
import { mapDishToSquareItem } from './mapping';

type CatalogApi = SquareClient['catalog'];

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
    const squareItemData = mapDishToSquareItem(dish);

    if (mapping) {
      // Update existing Square item
      const updateResponse = await catalogApi.batchUpsert({
        idempotencyKey: `${dish.id}-${Date.now()}`,
        batches: [
          {
            objects: [
              {
                type: 'ITEM',
                id: mapping.square_id,
                itemData: squareItemData.itemData,
              },
            ],
          },
        ],
      });

      if (updateResponse.objects?.[0]) {
        // Update mapping sync timestamp
        const { error: mappingUpdateError } = await supabaseAdmin
          .from('square_mappings')
          .update({
            last_synced_at: new Date().toISOString(),
            last_synced_to_square: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', mapping.id);

        if (mappingUpdateError) {
          logger.warn('[Square Catalog Sync] Error updating mapping sync timestamp:', {
            error: mappingUpdateError.message,
            mappingId: mapping.id,
          });
        }

        result.updated++;
        result.synced++;

        // Log sync operation
        await logCatalogSyncOperation({
          userId,
          direction: 'prepflow_to_square',
          entityId: dish.id,
          squareId: mapping.square_id,
          status: 'success',
        });
      } else {
        throw new Error('Failed to update Square item');
      }
    } else {
      // Create new Square item
      const createResponse = await catalogApi.batchUpsert({
        idempotencyKey: `${dish.id}-${Date.now()}`,
        batches: [
          {
            objects: [
              {
                type: 'ITEM',
                id: squareItemData.id,
                itemData: squareItemData.itemData,
              },
            ],
          },
        ],
      });

      if (createResponse.objects?.[0]?.id) {
        const squareItemId = createResponse.objects[0].id;

        // Create mapping
        const newMapping = await createAutoMapping(
          dish.id,
          squareItemId,
          'dish',
          userId,
          locationId,
        );

        if (!newMapping) {
          logger.error('[Square Catalog Sync] Error creating mapping:', {
            dishId: dish.id,
            squareItemId,
          });
          result.errors++;
          result.errorMessages?.push(`Failed to create mapping for dish ${dish.id}`);
          return;
        }

        result.created++;
        result.synced++;

        // Log sync operation
        await logCatalogSyncOperation({
          userId,
          direction: 'prepflow_to_square',
          entityId: dish.id,
          squareId: squareItemId,
          status: 'success',
        });
      } else {
        throw new Error('Failed to create Square item');
      }
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
