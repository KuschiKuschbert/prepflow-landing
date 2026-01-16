/**
 * Merge conflict resolution helpers for restore operations.
 */
import { logger } from '@/lib/logger';
import { getAppError } from '@/lib/utils/error';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseRecord, MergeOptions } from '../../types';
import {
  BATCH_SIZE,
  processInsertBatch,
  processUpdateBatch,
} from './merge-records/helpers/processBatches';

/**
 * Process merge conflicts and insert/update records accordingly.
 */
export async function mergeRecords(
  supabase: SupabaseClient,
  tableName: string,
  records: DatabaseRecord[],
  existingRecords: DatabaseRecord[],
  userId: string,
  options: MergeOptions,
): Promise<{ insertedCount: number; conflictCount: number; error?: string }> {
  if (records.length === 0) {
    return { insertedCount: 0, conflictCount: 0 };
  }

  let insertedCount = 0;
  let conflictCount = 0;

  try {
    // Create lookup map for existing records (by ID)
    const existingMap = new Map(existingRecords.map(r => [r.id as string, r]));

    // Process records in batches
    const batchToInsert: DatabaseRecord[] = [];
    const batchToUpdate: DatabaseRecord[] = [];

    for (const record of records) {
      const recordWithUserId = { ...record, user_id: userId };
      const recordId = record.id as string;
      const existingRecord = existingMap.get(recordId);

      if (existingRecord) {
        // Conflict detected
        conflictCount++;

        if (options.updateExisting) {
          batchToUpdate.push(recordWithUserId);
        } else if (options.createNewIds) {
          // Create new ID
          const { id, ...recordWithoutId } = recordWithUserId as DatabaseRecord;
          batchToInsert.push(recordWithoutId);
        }
        // else skip (default behavior)
      } else {
        // No conflict - insert
        batchToInsert.push(recordWithUserId);
      }

      if (batchToInsert.length >= BATCH_SIZE) {
        await processInsertBatch(supabase, tableName, batchToInsert);
        insertedCount += batchToInsert.length;
        batchToInsert.length = 0;
      }

      if (batchToUpdate.length >= BATCH_SIZE) {
        await processUpdateBatch(supabase, tableName, batchToUpdate, userId);
        insertedCount += batchToUpdate.length;
        batchToUpdate.length = 0;
      }
    }

    if (batchToInsert.length > 0) {
      await processInsertBatch(supabase, tableName, batchToInsert);
      insertedCount += batchToInsert.length;
    }

    if (batchToUpdate.length > 0) {
      await processUpdateBatch(supabase, tableName, batchToUpdate, userId);
      insertedCount += batchToUpdate.length;
    }

    return { insertedCount, conflictCount };
  } catch (error: unknown) {
    const appError = getAppError(error);
    if (appError.message?.includes('does not exist')) {
      logger.dev(`[Restore] Skipping table ${tableName}: ${appError.message}`);
      return { insertedCount, conflictCount, error: `Table ${tableName} does not exist` };
    }
    return {
      insertedCount,
      conflictCount,
      error: `Failed to merge ${tableName}: ${appError.message}`,
    };
  }
}

/** Get existing records for a table. */
export async function getExistingRecords(
  supabase: SupabaseClient,
  tableName: string,
  userId: string,
): Promise<DatabaseRecord[]> {
  // For child tables, we'll handle conflicts differently
  if (tableName === 'order_list_items' || tableName === 'prep_list_items') {
    return [];
  }

  // Parent table - get existing by user_id
  const { data, error } = await supabase.from(tableName).select('*').eq('user_id', userId);
  if (error) {
    logger.warn('[Restore] Error fetching existing records:', {
      error: error.message,
      code: error.code,
      context: { tableName, userId, operation: 'getExistingRecords' },
    });
  }
  return (data as DatabaseRecord[]) || [];
}
