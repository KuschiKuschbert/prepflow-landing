/**
 * Full restore operation - deletes all user data and restores from backup.
 */

import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { BackupData, RestoreResult } from '../types';
import { validateBackupUser } from './helpers/validate-restore';
import { deleteTables } from './helpers/delete-tables';
import { insertRecords } from './helpers/insert-records';

const TABLES_TO_DELETE = [
  'order_list_items',
  'prep_list_items',
  'order_lists',
  'prep_lists',
  'recipe_shares',
  'ai_specials_ingredients',
];

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
  validateBackupUser(userId, backup);

  // Delete all user data first (in reverse order to handle foreign keys)
  const deleteErrors = await deleteTables(supabase, TABLES_TO_DELETE, userId);
  errors.push(...deleteErrors);

  // Insert backup data
  for (const [tableName, records] of Object.entries(backup.tables)) {
    if (records.length === 0) {
      continue;
    }

    const { insertedCount, error } = await insertRecords(supabase, tableName, records, userId);

    if (error) {
      errors.push(error);
      logger.error(`[Restore] ${error}`);
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
