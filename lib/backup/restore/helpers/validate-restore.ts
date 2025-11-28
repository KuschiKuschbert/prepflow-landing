/**
 * Validation helpers for restore operations.
 */

import type { BackupData } from '../../types';

/**
 * Validate backup user ID matches current user.
 */
export function validateBackupUser(userId: string, backup: BackupData): void {
  if (backup.userId !== userId) {
    throw new Error('Backup user ID does not match current user');
  }
}

/**
 * Validate tables exist in backup.
 */
export function validateTablesExist(backup: BackupData, tables: string[]): void {
  const invalidTables = tables.filter(table => !backup.tables[table]);
  if (invalidTables.length > 0) {
    throw new Error(`Tables not found in backup: ${invalidTables.join(', ')}`);
  }
}
