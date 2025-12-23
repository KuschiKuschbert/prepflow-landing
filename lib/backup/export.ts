/**
 * Backup export engine - exports user-specific data from tables with user_id column.
 */

import type { BackupData, TableData } from './types';
import { fetchAllTableData } from './helpers/fetchAllTableData';
import { buildBackupData } from './helpers/buildBackupData';
import { convertToSQL } from './helpers/convertToSQL';
import { getUserTablesWithData } from './helpers/getUserTablesWithData';

/**
 * Export user data to JSON format.
 *
 * @param {string} userId - User ID (email)
 * @returns {Promise<BackupData>} Backup data structure
 */
export async function exportUserData(userId: string): Promise<BackupData> {
  const { tables, recordCounts } = await fetchAllTableData(userId);
  return buildBackupData(userId, [
    ...Object.entries(tables).map(([tableName, records]) => ({
      tableName,
      records,
      recordCount: recordCounts[tableName],
    })),
  ]);
}

export { convertToSQL, getUserTablesWithData };
