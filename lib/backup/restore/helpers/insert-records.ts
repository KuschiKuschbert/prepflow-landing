/**
 * Record insertion helpers for restore operations.
 */

import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';

const BATCH_SIZE = 100;

/**
 * Insert records into a table in batches.
 */
export async function insertRecords(
  supabase: SupabaseClient,
  tableName: string,
  records: any[],
  userId: string,
): Promise<{ insertedCount: number; error?: string }> {
  if (records.length === 0) {
    return { insertedCount: 0 };
  }

  let insertedCount = 0;

  try {
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);

      // Ensure user_id is set on all records
      const batchWithUserId = batch.map(record => ({
        ...record,
        user_id: userId,
      }));

      const { error } = await supabase.from(tableName).insert(batchWithUserId);

      if (error) {
        // Skip tables that don't exist
        if (error.message?.includes('does not exist')) {
          logger.dev(`[Restore] Skipping table ${tableName}: ${error.message}`);
          return { insertedCount, error: `Table ${tableName} does not exist` };
        }
        throw error;
      }

      insertedCount += batch.length;
    }

    logger.dev(`[Restore] Restored ${insertedCount} records to ${tableName}`);
    return { insertedCount };
  } catch (error: any) {
    logger.error('[insert-records.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      insertedCount,
      error: `Failed to restore ${tableName}: ${error.message}`,
    };
  }
}
