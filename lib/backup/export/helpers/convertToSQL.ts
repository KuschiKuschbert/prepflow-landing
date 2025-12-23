import type { BackupData } from '../types';

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
    if (records.length === 0) {
      continue;
    }

    sql.push(`-- Table: ${tableName}`);
    sql.push(`-- Records: ${records.length}`);
    sql.push('');

    // Get column names from first record
    const columns = Object.keys(records[0]);
    const columnsStr = columns.map(col => `"${col}"`).join(', ');

    // Generate INSERT statements (batch inserts for efficiency)
    const batchSize = 100;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const values = batch.map(record => {
        const rowValues = columns.map(col => {
          const value = record[col];
          if (value === null || value === undefined) {
            return 'NULL';
          }
          if (typeof value === 'string') {
            return `'${value.replace(/'/g, "''")}'`; // Escape single quotes
          }
          if (typeof value === 'boolean') {
            return value ? 'TRUE' : 'FALSE';
          }
          if (value instanceof Date) {
            return `'${value.toISOString()}'`;
          }
          return String(value);
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
