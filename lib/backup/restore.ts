/**
 * Backup restore engine - supports full, selective, and merge restore modes.
 */

import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { BackupData, RestoreResult, MergeOptions, ConflictResolution } from './types';

/**
 * Restore all user data (full restore).
 * Deletes all existing user data, then inserts backup data.
 *
 * @param {string} userId - User ID (email)
 * @param {BackupData} backup - Backup data to restore
 * @returns {Promise<RestoreResult>} Restore result
 */
export async function restoreFull(userId: string, backup: BackupData): Promise<RestoreResult> {
  const supabase = createSupabaseAdmin();
  const tablesRestored: string[] = [];
  const recordsRestored: Record<string, number> = {};
  const errors: string[] = [];

  // Validate backup user ID matches current user
  if (backup.userId !== userId) {
    throw new Error('Backup user ID does not match current user');
  }

  // Delete all user data first (in reverse order to handle foreign keys)
  const tablesToDelete = [
    'order_list_items',
    'prep_list_items',
    'order_lists',
    'prep_lists',
    'recipe_shares',
    'ai_specials_ingredients',
  ];

  for (const tableName of tablesToDelete) {
    try {
      // Get user's records to delete
      const { data: existingRecords } = await supabase
        .from(tableName)
        .select('id')
        .eq('user_id', userId);

      if (existingRecords && existingRecords.length > 0) {
        // For child tables, delete by foreign key
        if (tableName === 'order_list_items') {
          const { data: orderLists } = await supabase
            .from('order_lists')
            .select('id')
            .eq('user_id', userId);

          if (orderLists && orderLists.length > 0) {
            const orderListIds = orderLists.map(r => r.id);
            await supabase.from(tableName).delete().in('order_list_id', orderListIds);
          }
        } else if (tableName === 'prep_list_items') {
          const { data: prepLists } = await supabase
            .from('prep_lists')
            .select('id')
            .eq('user_id', userId);

          if (prepLists && prepLists.length > 0) {
            const prepListIds = prepLists.map(r => r.id);
            await supabase.from(tableName).delete().in('prep_list_id', prepListIds);
          }
        } else {
          // Parent table - delete by user_id
          await supabase.from(tableName).delete().eq('user_id', userId);
        }
      }
    } catch (error: any) {
      // Skip tables that don't exist
      if (error.message?.includes('does not exist')) {
        logger.dev(`[Restore] Skipping table ${tableName}: ${error.message}`);
        continue;
      }
      errors.push(`Failed to delete ${tableName}: ${error.message}`);
    }
  }

  // Insert backup data
  for (const [tableName, records] of Object.entries(backup.tables)) {
    if (records.length === 0) {
      continue;
    }

    try {
      // Insert records in batches
      const batchSize = 100;
      let insertedCount = 0;

      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);

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
            break;
          }
          throw error;
        }

        insertedCount += batch.length;
      }

      tablesRestored.push(tableName);
      recordsRestored[tableName] = insertedCount;
      logger.dev(`[Restore] Restored ${insertedCount} records to ${tableName}`);
    } catch (error: any) {
      errors.push(`Failed to restore ${tableName}: ${error.message}`);
      logger.error(`[Restore] Failed to restore ${tableName}:`, error);
    }
  }

  return {
    success: errors.length === 0,
    tablesRestored,
    recordsRestored,
    conflicts: {},
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Restore selected tables only (selective restore).
 * Deletes selected tables, then inserts backup data for those tables.
 *
 * @param {string} userId - User ID (email)
 * @param {BackupData} backup - Backup data to restore
 * @param {string[]} tables - Array of table names to restore
 * @returns {Promise<RestoreResult>} Restore result
 */
export async function restoreSelective(
  userId: string,
  backup: BackupData,
  tables: string[],
): Promise<RestoreResult> {
  const supabase = createSupabaseAdmin();
  const tablesRestored: string[] = [];
  const recordsRestored: Record<string, number> = {};
  const errors: string[] = [];

  // Validate backup user ID matches current user
  if (backup.userId !== userId) {
    throw new Error('Backup user ID does not match current user');
  }

  // Validate tables exist in backup
  const invalidTables = tables.filter(table => !backup.tables[table]);
  if (invalidTables.length > 0) {
    throw new Error(`Tables not found in backup: ${invalidTables.join(', ')}`);
  }

  // Delete selected tables
  for (const tableName of tables) {
    try {
      // Handle child tables
      if (tableName === 'order_list_items') {
        const { data: orderLists } = await supabase
          .from('order_lists')
          .select('id')
          .eq('user_id', userId);

        if (orderLists && orderLists.length > 0) {
          const orderListIds = orderLists.map(r => r.id);
          await supabase.from(tableName).delete().in('order_list_id', orderListIds);
        }
      } else if (tableName === 'prep_list_items') {
        const { data: prepLists } = await supabase
          .from('prep_lists')
          .select('id')
          .eq('user_id', userId);

        if (prepLists && prepLists.length > 0) {
          const prepListIds = prepLists.map(r => r.id);
          await supabase.from(tableName).delete().in('prep_list_id', prepListIds);
        }
      } else {
        // Parent table - delete by user_id
        await supabase.from(tableName).delete().eq('user_id', userId);
      }
    } catch (error: any) {
      if (error.message?.includes('does not exist')) {
        logger.dev(`[Restore] Skipping table ${tableName}: ${error.message}`);
        continue;
      }
      errors.push(`Failed to delete ${tableName}: ${error.message}`);
    }
  }

  // Insert backup data for selected tables
  for (const tableName of tables) {
    const records = backup.tables[tableName];
    if (!records || records.length === 0) {
      continue;
    }

    try {
      const batchSize = 100;
      let insertedCount = 0;

      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        const batchWithUserId = batch.map(record => ({
          ...record,
          user_id: userId,
        }));

        const { error } = await supabase.from(tableName).insert(batchWithUserId);

        if (error) {
          if (error.message?.includes('does not exist')) {
            logger.dev(`[Restore] Skipping table ${tableName}: ${error.message}`);
            break;
          }
          throw error;
        }

        insertedCount += batch.length;
      }

      tablesRestored.push(tableName);
      recordsRestored[tableName] = insertedCount;
    } catch (error: any) {
      errors.push(`Failed to restore ${tableName}: ${error.message}`);
    }
  }

  return {
    success: errors.length === 0,
    tablesRestored,
    recordsRestored,
    conflicts: {},
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Merge backup data with existing data (merge restore).
 * Inserts backup data, handling conflicts based on options.
 *
 * @param {string} userId - User ID (email)
 * @param {BackupData} backup - Backup data to restore
 * @param {MergeOptions} options - Merge options
 * @returns {Promise<RestoreResult>} Restore result
 */
export async function restoreMerge(
  userId: string,
  backup: BackupData,
  options?: MergeOptions,
): Promise<RestoreResult> {
  const supabase = createSupabaseAdmin();
  const tablesRestored: string[] = [];
  const recordsRestored: Record<string, number> = {};
  const conflicts: Record<string, number> = {};
  const errors: string[] = [];

  // Validate backup user ID matches current user
  if (backup.userId !== userId) {
    throw new Error('Backup user ID does not match current user');
  }

  // Default merge options
  const mergeOptions: MergeOptions = {
    conflictResolution: options?.conflictResolution || 'skip',
    skipExisting: options?.skipExisting !== false,
    updateExisting: options?.updateExisting || false,
    createNewIds: options?.createNewIds || false,
  };

  // Process each table
  for (const [tableName, records] of Object.entries(backup.tables)) {
    if (records.length === 0) {
      continue;
    }

    try {
      let insertedCount = 0;
      let conflictCount = 0;

      // Get existing records to check for conflicts
      let existingRecords: any[] = [];

      // For child tables, get existing via parent
      if (tableName === 'order_list_items' || tableName === 'prep_list_items') {
        // Child tables - we'll handle conflicts differently
        existingRecords = [];
      } else {
        // Parent table - get existing by user_id
        const { data } = await supabase.from(tableName).select('*').eq('user_id', userId);
        existingRecords = data || [];
      }

      // Create lookup map for existing records (by ID)
      const existingMap = new Map(existingRecords.map(r => [r.id, r]));

      // Process records in batches
      const batchSize = 100;
      const batchToInsert: any[] = [];
      const batchToUpdate: any[] = [];

      for (const record of records) {
        const recordWithUserId = { ...record, user_id: userId };
        const existingRecord = existingMap.get(record.id);

        if (existingRecord) {
          // Conflict detected
          conflictCount++;

          if (mergeOptions.updateExisting) {
            batchToUpdate.push(recordWithUserId);
          } else if (mergeOptions.createNewIds) {
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
        if (batchToInsert.length >= batchSize) {
          const { error } = await supabase.from(tableName).insert(batchToInsert);
          if (error) {
            throw error;
          }
          insertedCount += batchToInsert.length;
          batchToInsert.length = 0;
        }

        if (batchToUpdate.length >= batchSize) {
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

      if (insertedCount > 0 || conflictCount > 0) {
        tablesRestored.push(tableName);
        recordsRestored[tableName] = insertedCount;
        if (conflictCount > 0) {
          conflicts[tableName] = conflictCount;
        }
      }
    } catch (error: any) {
      if (error.message?.includes('does not exist')) {
        logger.dev(`[Restore] Skipping table ${tableName}: ${error.message}`);
        continue;
      }
      errors.push(`Failed to merge ${tableName}: ${error.message}`);
      logger.error(`[Restore] Failed to merge ${tableName}:`, error);
    }
  }

  return {
    success: errors.length === 0,
    tablesRestored,
    recordsRestored,
    conflicts,
    errors: errors.length > 0 ? errors : undefined,
  };
}
