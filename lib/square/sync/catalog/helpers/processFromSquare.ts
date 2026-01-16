/**
 * Process Square catalog items for sync to PrepFlow.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getMappingBySquareId } from '../../../mappings';
import type { SyncResult } from '../../catalog';
import { logCatalogSyncOperation } from './common';
import { createNewDish } from './createNewDish';
import { mapSquareItemToDish } from './mapping';
import { updateExistingDish } from './updateExistingDish';

/**
 * Process a single Square catalog item for sync to PrepFlow
 */
export async function processSquareCatalogItem(
  squareItem: any, // Keeping any for now to match SDK type issues, but removing others
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
  } catch (itemError: unknown) {
    const errorMessage = itemError instanceof Error ? itemError.message : String(itemError);
    const stack = itemError instanceof Error ? itemError.stack : undefined;

    logger.error('[Square Catalog Sync] Error processing Square item:', {
      error: errorMessage,
      squareItemId: squareItem.id,
    });
    result.errors++;
    result.errorMessages?.push(
      `Failed to process Square item ${squareItem.id}: ${errorMessage}`,
    );

    await logCatalogSyncOperation({
      userId,
      direction: 'square_to_prepflow',
      squareId: squareItem.id,
      status: 'error',
      errorMessage: errorMessage,
      errorDetails: { stack },
    });
  }
}
