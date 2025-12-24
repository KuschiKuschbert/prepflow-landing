/**
 * Process Square catalog items for sync to PrepFlow.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getMappingBySquareId } from '../../../mappings';
import { mapSquareItemToDish } from './mapping';
import { logCatalogSyncOperation } from './common';
import { updateExistingDish } from './updateExistingDish';
import { createNewDish } from './createNewDish';
import type { SyncResult } from '../../catalog';

/**
 * Process a single Square catalog item for sync to PrepFlow
 */
export async function processSquareCatalogItem(
  squareItem: any,
  userId: string,
  locationId: string,
  result: SyncResult,
): Promise<void> {
  if (!supabaseAdmin) {
    result.errorMessages?.push('Database connection not available');
    return;
  }

  try {
    if (!squareItem.id || !squareItem.itemData) {
      return;
    }

    const squareItemId = squareItem.id;
    const mapping = await getMappingBySquareId(squareItemId, 'dish', userId, locationId);
    const dishData = mapSquareItemToDish(squareItem, locationId);

    if (mapping) {
      await updateExistingDish(mapping, dishData, squareItemId, userId, result);
    } else {
      await createNewDish(dishData, squareItemId, userId, locationId, result);
    }
  } catch (itemError: any) {
    logger.error('[Square Catalog Sync] Error processing Square item:', {
      error: itemError.message,
      squareItemId: squareItem.id,
    });
    result.errors++;
    result.errorMessages?.push(
      `Failed to process Square item ${squareItem.id}: ${itemError.message}`,
    );

    await logCatalogSyncOperation({
      userId,
      direction: 'square_to_prepflow',
      squareId: squareItem.id,
      status: 'error',
      errorMessage: itemError.message,
      errorDetails: { stack: itemError.stack },
    });
  }
}
