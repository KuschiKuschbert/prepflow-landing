/**
 * Upsert sales data to database.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { SalesData, SyncResult } from '../types';

/**
 * Upsert sales data to database.
 */
export async function upsertSalesData(
  salesDataArray: SalesData[],
  result: SyncResult,
): Promise<void> {
  if (!supabaseAdmin) {
    return;
  }

  for (const salesData of salesDataArray) {
    try {
      const { data, error } = await supabaseAdmin
        .from('sales_data')
        .upsert(
          {
            dish_id: salesData.dish_id,
            number_sold: salesData.number_sold,
            popularity_percentage: salesData.popularity_percentage,
            date: salesData.date,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'dish_id,date',
          },
        )
        .select();

      if (error) {
        logger.error('[Square Orders Sync] Error upserting sales data:', {
          error: error.message,
          dishId: salesData.dish_id,
          date: salesData.date,
        });
        result.errors++;
        result.errorMessages?.push(
          `Failed to upsert sales data for dish ${salesData.dish_id}: ${error.message}`,
        );
        continue;
      }

      // Check if record was created or updated
      if (data && data.length > 0) {
        // Check if created_at equals updated_at (new record)
        const isNew = data[0].created_at === data[0].updated_at;
        if (isNew) {
          result.created++;
        } else {
          result.updated++;
        }
        result.synced++;
      }
    } catch (upsertError: any) {
      logger.error('[Square Orders Sync] Error upserting sales data:', {
        error: upsertError.message,
        dishId: salesData.dish_id,
      });
      result.errors++;
      result.errorMessages?.push(
        `Failed to upsert sales data for dish ${salesData.dish_id}: ${upsertError.message}`,
      );
    }
  }
}
