/**
 * Selective restore operation - restores only specified tables.
 */

import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { BackupData, RestoreResult } from '../types';
import { validateBackupUser, validateTablesExist } from './helpers/validate-restore';
import { deleteTableRecords } from './helpers/delete-tables';
import { insertRecords } from './helpers/insert-records';

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
  validateBackupUser(userId, backup);

  // Validate tables exist in backup
  validateTablesExist(backup, tables);

  // Delete selected tables
  for (const tableName of tables) {
    try {
      await deleteTableRecords(supabase, tableName, userId);
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

    const { insertedCount, error } = await insertRecords(supabase, tableName, records, userId);

    if (error) {
      errors.push(error);
    } else if (insertedCount > 0) {
      tablesRestored.push(tableName);
      recordsRestored[tableName] = insertedCount;
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
