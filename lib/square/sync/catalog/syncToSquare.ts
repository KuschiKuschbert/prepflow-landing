/**
 * Sync dishes from PrepFlow to Square.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getSquareClient } from '../../client';
import { getSquareConfig } from '../../config';
import { logSyncOperation } from '../../sync-log';
import { processPrepFlowDish } from './helpers/processToSquare';
import { updateLastCatalogSyncTimestamp } from './helpers/common';
import type { SyncResult } from '../catalog';

/**
 * Sync dishes from PrepFlow to Square
 * Creates or updates Square catalog items based on PrepFlow dishes
 */
export async function syncCatalogToSquare(userId: string, dishIds?: string[]): Promise<SyncResult> {
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

    const targetLocationId = config.default_location_id;
    if (!targetLocationId) {
      throw new Error('Location ID is required for catalog sync');
    }

    // Fetch PrepFlow dishes
    let query = supabaseAdmin.from('dishes').select('*');

    if (dishIds && dishIds.length > 0) {
      query = query.in('id', dishIds);
    }

    const { data: dishes, error: dishesError } = await query;

    if (dishesError) {
      logger.error('[Square Catalog Sync] Failed to fetch dishes:', {
        error: dishesError.message,
        userId,
      });
      result.errorMessages?.push(`Failed to fetch dishes: ${dishesError.message}`);
      result.errors++;
      return result;
    }

    if (!dishes || dishes.length === 0) {
      logger.warn('[Square Catalog Sync] No dishes found in PrepFlow');
      result.success = true;
      return result;
    }

    logger.dev('[Square Catalog Sync] Found PrepFlow dishes:', {
      count: dishes.length,
      userId,
    });

    const catalogApi = client.catalog;

    // Process each dish
    for (const dish of dishes) {
      await processPrepFlowDish(dish, userId, targetLocationId, catalogApi, result);
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
      direction: 'prepflow_to_square',
      status: 'error',
      error_message: error.message,
      error_details: { stack: error.stack },
    });

    return result;
  }
}




