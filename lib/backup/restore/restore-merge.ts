/**
 * Merge restore operation - merges backup data with existing data.
 */

import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import type { BackupData, MergeOptions, RestoreResult } from '../types';
import { getExistingRecords, mergeRecords } from './helpers/merge-records';
import { validateBackupUser } from './helpers/validate-restore';

/**
 * Default merge options.
 */
function getDefaultMergeOptions(options?: MergeOptions): MergeOptions {
  return {
    conflictResolution: options?.conflictResolution || 'skip',
    skipExisting: options?.skipExisting !== false,
    updateExisting: options?.updateExisting || false,
    createNewIds: options?.createNewIds || false,
  };
}

/**
 * Restore selected tables only (selective restore).
 * Deletes selected tables, then inserts backup data for those tables.
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
  validateBackupUser(userId, backup);

  // Default merge options
  const mergeOptions = getDefaultMergeOptions(options);

  // Process each table
  for (const [tableName, records] of Object.entries(backup.tables)) {
    if (records.length === 0) {
      continue;
    }

    try {
      // Get existing records to check for conflicts
      const existingRecords = await getExistingRecords(supabase, tableName, userId);

      // Merge records
      const { insertedCount, conflictCount, error } = await mergeRecords(
        supabase,
        tableName,
        records,
        existingRecords,
        userId,
        mergeOptions,
      );

      if (error) {
        errors.push(error);
        logger.error(`[Restore] ${error}`);
      } else if (insertedCount > 0 || conflictCount > 0) {
        tablesRestored.push(tableName);
        recordsRestored[tableName] = insertedCount;
        if (conflictCount > 0) {
          conflicts[tableName] = conflictCount;
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('does not exist')) {
        logger.dev(`[Restore] Skipping table ${tableName}: ${errorMessage}`);
        continue;
      }
      errors.push(`Failed to merge ${tableName}: ${errorMessage}`);
      logger.error(`[Restore] Failed to merge ${tableName}:`, { error: errorMessage });
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
