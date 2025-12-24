/**
 * Sync costs from PrepFlow to Square.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getSquareClient } from '../../client';
import { getSquareConfig } from '../../config';
import { logSyncOperation } from '../../sync-log';
import { processDishCostSync } from './helpers/processDish';
import type { SyncResult } from '../costs';

/**
 * Sync food costs from PrepFlow to Square
 * Updates Square catalog items with cost data from PrepFlow dishes
 */
export async function syncCostsToSquare(userId: string, dishIds?: string[]): Promise<SyncResult> {
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

    // Fetch dishes with Square mappings
    let query = supabaseAdmin
      .from('dishes')
      .select(
        `
        *,
        square_mappings!inner (
          square_id,
          entity_type
        )
      `,
      )
      .eq('square_mappings.entity_type', 'dish');

    if (dishIds && dishIds.length > 0) {
      query = query.in('id', dishIds);
    }

    const { data: dishesWithMappings, error: dishesError } = await query;

    if (dishesError) {
      logger.error('[Square Cost Sync] Failed to fetch dishes:', {
        error: dishesError.message,
        userId,
      });
      result.errorMessages?.push(`Failed to fetch dishes: ${dishesError.message}`);
      result.errors++;
      return result;
    }

    if (!dishesWithMappings || dishesWithMappings.length === 0) {
      logger.warn('[Square Cost Sync] No dishes with Square mappings found');
      result.success = true;
      return result;
    }

    logger.dev('[Square Cost Sync] Found dishes with Square mappings:', {
      count: dishesWithMappings.length,
      userId,
    });

    // Process each dish
    for (const dishData of dishesWithMappings) {
      await processDishCostSync(dishData as any, client, userId, result);
    }

    result.success = result.errors === 0;
    result.metadata = {
      dishesProcessed: dishesWithMappings.length,
      costsSynced: result.synced,
    };

    return result;
  } catch (error: any) {
    logger.error('[Square Cost Sync] Fatal error:', {
      error: error.message,
      userId,
      stack: error.stack,
    });

    result.errorMessages?.push(`Fatal error: ${error.message}`);

    await logSyncOperation({
      user_id: userId,
      operation_type: 'sync_costs',
      direction: 'prepflow_to_square',
      status: 'error',
      error_message: error.message,
      error_details: { stack: error.stack },
    });

    return result;
  }
}
