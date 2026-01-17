/**
 * Update existing dish from Square catalog item.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { SquareMapping } from '../../../mappings/types';
import type { Dish, SyncResult } from '../../catalog';
import { logCatalogSyncOperation } from './common';

export async function updateExistingDish(
  mapping: SquareMapping,
  dishData: Dish,
  squareItemId: string,
  userId: string,
  result: SyncResult,
): Promise<void> {
  if (!supabaseAdmin) {
    return;
  }

  const { error: updateError } = await supabaseAdmin
    .from('dishes')
    .update({
      dish_name: dishData.dish_name,
      description: dishData.description,
      selling_price: dishData.selling_price,
      category: dishData.category,
      updated_at: new Date().toISOString(),
    })
    .eq('id', mapping.prepflow_id);

  if (updateError) {
    logger.error('[Square Catalog Sync] Error updating dish:', {
      error: updateError.message,
      dishId: mapping.prepflow_id,
      squareItemId,
    });
    result.errors++;
    result.errorMessages?.push(
      `Failed to update dish ${mapping.prepflow_id}: ${updateError.message}`,
    );
    return;
  }

  const { error: mappingUpdateError } = await supabaseAdmin
    .from('square_mappings')
    .update({
      last_synced_at: new Date().toISOString(),
      last_synced_from_square: new Date().toISOString(),
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

  await logCatalogSyncOperation({
    userId,
    direction: 'square_to_prepflow',
    entityId: mapping.prepflow_id,
    squareId: squareItemId,
    status: 'success',
  });

  // Dual-write to POS Table
  try {
    await supabaseAdmin.from('pos_menu_items').upsert(
      {
        name: dishData.dish_name,
        category: dishData.category || 'Uncategorized',
        price: dishData.selling_price || 0,
        square_id: squareItemId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'square_id' },
    );
  } catch (error: unknown) {
    logger.warn(
      '[Square Catalog Sync] Failed to sync to POS table:',
      error instanceof Error ? error.message : String(error),
    );
  }
}
