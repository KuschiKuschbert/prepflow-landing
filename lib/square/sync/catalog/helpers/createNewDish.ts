/**
 * Create new dish from Square catalog item.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { createAutoMapping } from '../../../mappings';
import type { Dish, SyncResult } from '../../catalog';
import { logCatalogSyncOperation } from './common';

export async function createNewDish(
  dishData: Dish,
  squareItemId: string,
  userId: string,
  locationId: string,
  result: SyncResult,
): Promise<void> {
  if (!supabaseAdmin) {
    return;
  }

  const { data: newDish, error: createError } = await supabaseAdmin
    .from('dishes')
    .insert({
      dish_name: dishData.dish_name,
      description: dishData.description,
      selling_price: dishData.selling_price,
      category: dishData.category,
    })
    .select()
    .single();

  if (createError || !newDish) {
    logger.error('[Square Catalog Sync] Error creating dish:', {
      error: createError?.message,
      squareItemId,
    });
    result.errors++;
    result.errorMessages?.push(`Failed to create dish: ${createError?.message || 'Unknown error'}`);
    return;
  }

  const newMapping = await createAutoMapping(newDish.id, squareItemId, 'dish', userId, locationId);

  if (!newMapping) {
    logger.error('[Square Catalog Sync] Error creating mapping:', {
      dishId: newDish.id,
      squareItemId,
    });
    result.errors++;
    result.errorMessages?.push(`Failed to create mapping for dish ${newDish.id}`);
    return;
  }

  result.created++;
  result.synced++;

  await logCatalogSyncOperation({
    userId,
    direction: 'square_to_prepflow',
    entityId: newDish.id,
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
        is_available: true,
        square_id: squareItemId,
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
