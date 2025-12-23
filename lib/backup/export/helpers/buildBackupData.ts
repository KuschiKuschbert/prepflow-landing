import type { BackupData, TableData } from '../types';

/**
 * Build backup data structure from table data.
 *
 * @param {string} userId - User ID (email)
 * @param {TableData[]} tables - Array of table data
 * @returns {BackupData} Backup data structure
 */
export function buildBackupData(userId: string, tables: TableData[]): BackupData {
  const tablesData: Record<string, any[]> = {};
  const recordCounts: Record<string, number> = {};

  for (const table of tables) {
    tablesData[table.tableName] = table.records;
    recordCounts[table.tableName] = table.recordCount;
  }

  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    userId,
    tables: tablesData,
    metadata: {
      recordCounts,
      exportFormat: 'json',
    },
  };
}
