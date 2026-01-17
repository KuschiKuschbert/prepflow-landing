/**
 * Update sync timestamp and log operation.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { logSyncOperation } from '../../../sync-log';
import type { SyncResult } from '../types';

import { Order } from 'square';

/**
 * Update sync timestamp and log operation.
 */
export async function updateSyncTimestampAndLog(
  userId: string,
  orders: Order[],
  result: SyncResult,
  startDate: string,
  endDate: string,
): Promise<void> {
  if (!supabaseAdmin) {
    return;
  }

  // Update last sync timestamp
  const { error: updateTimestampError } = await supabaseAdmin
    .from('square_configurations')
    .update({
      last_sales_sync_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (updateTimestampError) {
    logger.warn('[Square Orders Sync] Failed to update last sync timestamp:', {
      error: updateTimestampError.message,
      userId,
    });
  }

  // Log successful sync operation
  await logSyncOperation({
    user_id: userId,
    operation_type: 'sync_orders',
    direction: 'square_to_prepflow',
    status: 'success',
    sync_metadata: {
      ordersProcessed: orders.length,
      salesRecordsCreated: result.created,
      salesRecordsUpdated: result.updated,
      dateRange: { startDate, endDate },
    },
  });
}
