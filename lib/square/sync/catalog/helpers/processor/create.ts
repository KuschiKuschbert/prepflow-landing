import { logger } from '@/lib/logger';
import { createAutoMapping } from '../../../../mappings';
import type { Dish, SyncResult } from '../../../catalog';
import { logCatalogSyncOperation } from '../common';
import type { CatalogApi } from './types';

export async function createSquareCatalogItem(
  userId: string,
  locationId: string,
  dish: Dish,
  squareItemData: { id?: string; itemData: any },
  catalogApi: CatalogApi,
  result: SyncResult,
): Promise<void> {
  // Create new Square item
  const createResponse = await catalogApi.batchUpsert({
    idempotencyKey: `${dish.id}-${Date.now()}`,
    batches: [
      {
        objects: [
          {
            type: 'ITEM',
            id: squareItemData.id!, // Assumed to be present for creation
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
