import type { BackupData } from '../../types';
import { formatSQLValue } from './formatSQLValue';

/**
 * Convert backup data to SQL format.
 *
 * @param {BackupData} backupData - Backup data structure
 * @returns {string} SQL dump string
 */
export function convertToSQL(backupData: BackupData): string {
  const sql: string[] = [];
  sql.push('-- PrepFlow Backup SQL Export');
  sql.push(`-- Version: ${backupData.version}`);
  sql.push(`-- Timestamp: ${backupData.timestamp}`);
  sql.push(`-- User ID: ${backupData.userId}`);
  sql.push('');

  // Generate INSERT statements for each table
  for (const [tableName, records] of Object.entries(backupData.tables)) {
    const typedRecords = records as Record<string, unknown>[];
    if (typedRecords.length === 0) {
      continue;
    }

    sql.push(`-- Table: ${tableName}`);
    sql.push(`-- Records: ${typedRecords.length}`);
    sql.push('');

    // Get column names from first record
    const columns = Object.keys(typedRecords[0]);
    const columnsStr = columns.map(col => `"${col}"`).join(', ');

    // Generate INSERT statements (batch inserts for efficiency)
    const batchSize = 100;
    for (let i = 0; i < typedRecords.length; i += batchSize) {
      const batch = typedRecords.slice(i, i + batchSize);
      const values = batch.map(record => {
        const rowValues = columns.map(col => {
          const value = record[col];
          return formatSQLValue(value);
        });
        return `(${rowValues.join(', ')})`;
      });

      sql.push(`INSERT INTO "${tableName}" (${columnsStr}) VALUES`);
      sql.push(values.join(',\n'));
      sql.push(';');
      sql.push('');
    }
  }

  return sql.join('\n');
}
