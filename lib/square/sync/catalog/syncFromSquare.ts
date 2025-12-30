/**
 * Sync catalog items from Square to PrepFlow.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getSquareClient } from '../../client';
import { getSquareConfig } from '../../config';
import { logSyncOperation } from '../../sync-log';
import { processSquareCatalogItem } from './helpers/processFromSquare';
import { updateLastCatalogSyncTimestamp } from './helpers/common';
import type { SyncResult } from '../catalog';

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
    const listResponse = await (catalogApi as any).listCatalog(undefined, 'ITEM');

    if (!listResponse.result?.objects) {
      logger.warn('[Square Catalog Sync] No catalog items found in Square');
      result.success = true;
      return result;
    }

    const squareItems = listResponse.result.objects.filter(
      (obj: any) => obj.type === 'ITEM' && obj.itemData,
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
  } catch (error: any) {
    logger.error('[Square Catalog Sync] Fatal error:', {
      error: error.message,
      userId,
      stack: error.stack,
    });

    result.errorMessages?.push(`Fatal error: ${error.message}`);

    await logSyncOperation({
      user_id: userId,
      operation_type: 'sync_catalog',
      direction: 'square_to_prepflow',
      status: 'error',
      error_message: error.message,
      error_details: { stack: error.stack },
    });

    return result;
  }
}


