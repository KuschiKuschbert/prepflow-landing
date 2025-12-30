/**
 * Process PrepFlow dishes for sync to Square.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getMappingByPrepFlowId, createAutoMapping } from '../../../mappings';
import { mapDishToSquareItem } from './mapping';
import { logCatalogSyncOperation } from './common';
import type { Dish, SyncResult } from '../../catalog';

/**
 * Process a single PrepFlow dish for sync to Square
 */
export async function processPrepFlowDish(
  dish: Dish,
  userId: string,
  locationId: string,
  catalogApi: any,
  result: SyncResult,
): Promise<void> {
  if (!supabaseAdmin) {
    result.errorMessages?.push('Database connection not available');
    return;
  }

  try {
    // Check if mapping exists
    let mapping = await getMappingByPrepFlowId(dish.id, 'dish', userId);

    // Map PrepFlow dish to Square catalog item
    const squareItemData = mapDishToSquareItem(dish);

    if (mapping) {
      // Update existing Square item
      const updateResponse = await catalogApi.upsertCatalogObject({
        idempotencyKey: `${dish.id}-${Date.now()}`,
        object: {
          type: 'ITEM',
          id: mapping.square_id,
          itemData: squareItemData.itemData,
        },
      });

      if (updateResponse.result?.catalogObject) {
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
      const createResponse = await catalogApi.upsertCatalogObject({
        idempotencyKey: `${dish.id}-${Date.now()}`,
        object: {
          type: 'ITEM',
          itemData: squareItemData.itemData,
        },
      });

      if (createResponse.result?.catalogObject && createResponse.result.catalogObject.id) {
        const squareItemId = createResponse.result.catalogObject.id;

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
  } catch (dishError: any) {
    logger.error('[Square Catalog Sync] Error processing dish:', {
      error: dishError.message,
      dishId: dish.id,
    });
    result.errors++;
    result.errorMessages?.push(`Failed to process dish ${dish.id}: ${dishError.message}`);

    await logCatalogSyncOperation({
      userId,
      direction: 'prepflow_to_square',
      entityId: dish.id,
      status: 'error',
      errorMessage: dishError.message,
      errorDetails: { stack: dishError.stack },
    });
  }
}



