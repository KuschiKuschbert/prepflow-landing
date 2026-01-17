/**
 * Process Square catalog items for sync to PrepFlow.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { SquareClient } from 'square';
import { getMappingBySquareId } from '../../../mappings';
import type { SyncResult } from '../../catalog';
import { SquareCatalogObject } from '../../catalog';
import { logCatalogSyncOperation } from './common';
import { createNewDish } from './createNewDish';
import { mapSquareItemToDish } from './mapping';
import { updateExistingDish } from './updateExistingDish';

type CatalogApi = SquareClient['catalog'];
type CatalogObject = NonNullable<Awaited<ReturnType<CatalogApi['batchGet']>>['objects']>[number];

/**
 * Process a single Square catalog item for sync to PrepFlow
 */
export async function processSquareCatalogItem(
  squareItem: CatalogObject,
  userId: string,
  locationId: string,
  result: SyncResult,
): Promise<void> {
  if (!supabaseAdmin) {
    result.errorMessages?.push('Database connection not available');
    return;
  }

  try {
    if (!squareItem.id || squareItem.type !== 'ITEM' || !squareItem.itemData) {
      return;
    }

    const squareItemId = squareItem.id;
    const mapping = await getMappingBySquareId(squareItemId, 'dish', userId, locationId);
    const dishData = mapSquareItemToDish(squareItem as unknown as SquareCatalogObject, locationId);

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
    result.errorMessages?.push(`Failed to process Square item ${squareItem.id}: ${errorMessage}`);

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
