import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { Dish, SyncResult } from '../../../catalog';
import { logCatalogSyncOperation } from '../common';
import type { CatalogApi } from './types';

export async function updateSquareCatalogItem(
  userId: string,
  dish: Dish,
  mapping: { id: string; square_id: string },
  squareItemData: { id?: string; itemData: any },
  catalogApi: CatalogApi,
  result: SyncResult,
): Promise<void> {
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
    if (supabaseAdmin) {
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
}
