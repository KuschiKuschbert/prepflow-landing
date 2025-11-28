/**
 * Merge conflict resolution helpers for restore operations.
 */

import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { MergeOptions } from '../../types';

const BATCH_SIZE = 100;

/**
 * Process merge conflicts and insert/update records accordingly.
 */
export async function mergeRecords(
  supabase: SupabaseClient,
  tableName: string,
  records: any[],
  existingRecords: any[],
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
    const existingMap = new Map(existingRecords.map(r => [r.id, r]));

    // Process records in batches
    const batchToInsert: any[] = [];
    const batchToUpdate: any[] = [];

    for (const record of records) {
      const recordWithUserId = { ...record, user_id: userId };
      const existingRecord = existingMap.get(record.id);

      if (existingRecord) {
        // Conflict detected
        conflictCount++;

        if (options.updateExisting) {
          batchToUpdate.push(recordWithUserId);
        } else if (options.createNewIds) {
          // Create new ID
          delete recordWithUserId.id;
          batchToInsert.push(recordWithUserId);
        }
        // else skip (default behavior)
      } else {
        // No conflict - insert
        batchToInsert.push(recordWithUserId);
      }

      // Process batch when full
      if (batchToInsert.length >= BATCH_SIZE) {
        const { error } = await supabase.from(tableName).insert(batchToInsert);
        if (error) {
          throw error;
        }
        insertedCount += batchToInsert.length;
        batchToInsert.length = 0;
      }

      if (batchToUpdate.length >= BATCH_SIZE) {
        for (const updateRecord of batchToUpdate) {
          const { error } = await supabase
            .from(tableName)
            .update(updateRecord)
            .eq('id', updateRecord.id)
            .eq('user_id', userId);

          if (error) {
            throw error;
          }
        }
        insertedCount += batchToUpdate.length;
        batchToUpdate.length = 0;
      }
    }

    // Process remaining batches
    if (batchToInsert.length > 0) {
      const { error } = await supabase.from(tableName).insert(batchToInsert);
      if (error) {
        throw error;
      }
      insertedCount += batchToInsert.length;
    }

    if (batchToUpdate.length > 0) {
      for (const updateRecord of batchToUpdate) {
        const { error } = await supabase
          .from(tableName)
          .update(updateRecord)
          .eq('id', updateRecord.id)
          .eq('user_id', userId);

        if (error) {
          throw error;
        }
      }
      insertedCount += batchToUpdate.length;
    }

    return { insertedCount, conflictCount };
  } catch (error: any) {
    if (error.message?.includes('does not exist')) {
      logger.dev(`[Restore] Skipping table ${tableName}: ${error.message}`);
      return { insertedCount, conflictCount, error: `Table ${tableName} does not exist` };
    }
    return {
      insertedCount,
      conflictCount,
      error: `Failed to merge ${tableName}: ${error.message}`,
    };
  }
}

/**
 * Get existing records for a table.
 */
export async function getExistingRecords(
  supabase: SupabaseClient,
  tableName: string,
  userId: string,
): Promise<any[]> {
  // For child tables, we'll handle conflicts differently
  if (tableName === 'order_list_items' || tableName === 'prep_list_items') {
    return [];
  }

  // Parent table - get existing by user_id
  const { data } = await supabase.from(tableName).select('*').eq('user_id', userId);
  return data || [];
}
