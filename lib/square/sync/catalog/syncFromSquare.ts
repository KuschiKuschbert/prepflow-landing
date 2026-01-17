/**
 * Sync catalog items from Square to PrepFlow.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getSquareClient } from '../../client';
import { getSquareConfig } from '../../config';
import { logSyncOperation } from '../../sync-log';
import type { SquareCatalogObject, SyncResult } from '../catalog';
import { updateLastCatalogSyncTimestamp } from './helpers/common';
import { processSquareCatalogItem } from './helpers/processFromSquare';

/**
 * Sync catalog items from Square to PrepFlow
 * Creates or updates dishes based on Square catalog items
 */
export async function syncCatalogFromSquare(
  userId: string,
  locationId?: string,
): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    synced: 0,
    created: 0,
    updated: 0,
    errors: 0,
    errorMessages: [],
  };

  if (!supabaseAdmin) {
    result.errorMessages?.push('Database connection not available');
    return result;
  }

  try {
    const client = await getSquareClient(userId);
    if (!client) {
      throw new Error('Square client not available');
    }

    const config = await getSquareConfig(userId);
    if (!config) {
      throw new Error('Square configuration not found');
    }

    const targetLocationId = locationId || config.default_location_id;
    if (!targetLocationId) {
      throw new Error('Location ID is required for catalog sync');
    }

    // Fetch Square catalog items
    const catalogApi = client.catalog;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listResponse = await (catalogApi as any).listCatalog(undefined, 'ITEM');

    if (!listResponse.result?.objects) {
      logger.warn('[Square Catalog Sync] No catalog items found in Square');
      result.success = true;
      return result;
    }

    const squareItems = (listResponse.result.objects as SquareCatalogObject[]).filter(
      (obj) => obj.type === 'ITEM' && obj.itemData,
    );

    logger.dev('[Square Catalog Sync] Found Square items:', {
      count: squareItems.length,
      userId,
      locationId: targetLocationId,
    });

    // Process each Square item
    for (const squareItem of squareItems) {
      await processSquareCatalogItem(squareItem, userId, targetLocationId, result);
    }

    // Update last sync timestamp
    await updateLastCatalogSyncTimestamp(userId);

    result.success = result.errors === 0;
    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    logger.error('[Square Catalog Sync] Fatal error:', {
      error: errorMessage,
      userId,
      stack,
    });

    result.errorMessages?.push(`Fatal error: ${errorMessage}`);

    await logSyncOperation({
      user_id: userId,
      operation_type: 'sync_catalog',
      direction: 'square_to_prepflow',
      status: 'error',
      error_message: errorMessage,
      error_details: { stack },
    });

    return result;
  }
}
