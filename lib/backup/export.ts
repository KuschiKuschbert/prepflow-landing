/**
 * Backup export engine - exports user-specific data from tables with user_id column.
 */

import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { BackupData, TableData, BackupFormat } from './types';

/**
 * Get list of tables that have user_id column and should be backed up.
 */
const USER_TABLES = [
  { name: 'order_lists', idColumn: 'id' },
  { name: 'prep_lists', idColumn: 'id' },
  { name: 'recipe_shares', idColumn: 'id' },
  { name: 'ai_specials_ingredients', idColumn: 'id' },
];

/**
 * Child tables that reference parent tables (no user_id on child rows).
 */
const CHILD_TABLES = [
  {
    name: 'order_list_items',
    fk: 'order_list_id',
    parentTable: 'order_lists',
    parentIdColumn: 'id',
  },
  {
    name: 'prep_list_items',
    fk: 'prep_list_id',
    parentTable: 'prep_lists',
    parentIdColumn: 'id',
  },
];

/**
 * Get user-specific data from a table.
 *
 * @param {string} userId - User ID (email)
 * @param {string} tableName - Table name
 * @returns {Promise<any[]>} Array of records
 */
async function getUserTableData(userId: string, tableName: string): Promise<any[]> {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase.from(tableName).select('*').eq('user_id', userId);

  if (error) {
    // Skip tables that don't exist or don't have user_id column
    if (
      error.message.includes('does not exist') ||
      error.message.includes('column') ||
      error.message.includes('user_id')
    ) {
      logger.dev(`[Backup Export] Skipping table ${tableName}: ${error.message}`);
      return [];
    }
    throw new Error(`Failed to export ${tableName}: ${error.message}`);
  }

  return data || [];
}

/**
 * Get child table data by parent IDs.
 *
 * @param {string} tableName - Child table name
 * @param {string} fkColumn - Foreign key column name
 * @param {string[]} parentIds - Array of parent IDs
 * @returns {Promise<any[]>} Array of child records
 */
async function getChildTableData(
  tableName: string,
  fkColumn: string,
  parentIds: string[],
): Promise<any[]> {
  if (parentIds.length === 0) {
    return [];
  }

  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase.from(tableName).select('*').in(fkColumn, parentIds);

  if (error) {
    // Skip tables that don't exist
    if (error.message.includes('does not exist')) {
      logger.dev(`[Backup Export] Skipping child table ${tableName}: ${error.message}`);
      return [];
    }
    throw new Error(`Failed to export child table ${tableName}: ${error.message}`);
  }

  return data || [];
}

/**
 * Export user data to JSON format.
 *
 * @param {string} userId - User ID (email)
 * @returns {Promise<BackupData>} Backup data structure
 */
export async function exportUserData(userId: string): Promise<BackupData> {
  const tables: Record<string, any[]> = {};
  const recordCounts: Record<string, number> = {};

  // Export parent tables with user_id
  for (const table of USER_TABLES) {
    try {
      const data = await getUserTableData(userId, table.name);
      tables[table.name] = data;
      recordCounts[table.name] = data.length;
      logger.dev(`[Backup Export] Exported ${data.length} records from ${table.name}`);
    } catch (error) {
      logger.error(`[Backup Export] Failed to export ${table.name}:`, error);
      tables[table.name] = [];
      recordCounts[table.name] = 0;
    }
  }

  // Export child tables
  for (const childTable of CHILD_TABLES) {
    try {
      // Get parent IDs from the parent table data
      const parentData = tables[childTable.parentTable] || [];
      const parentIds = parentData
        .map((row: any) => row[childTable.parentIdColumn])
        .filter(Boolean);

      if (parentIds.length > 0) {
        const childData = await getChildTableData(childTable.name, childTable.fk, parentIds);
        tables[childTable.name] = childData;
        recordCounts[childTable.name] = childData.length;
        logger.dev(`[Backup Export] Exported ${childData.length} records from ${childTable.name}`);
      } else {
        tables[childTable.name] = [];
        recordCounts[childTable.name] = 0;
      }
    } catch (error) {
      logger.error(`[Backup Export] Failed to export ${childTable.name}:`, error);
      tables[childTable.name] = [];
      recordCounts[childTable.name] = 0;
    }
  }

  const backupData: BackupData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    userId,
    tables,
    metadata: {
      recordCounts,
      exportFormat: 'json',
    },
  };

  return backupData;
}

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

/**
 * Get list of tables with data for a user.
 *
 * @param {string} userId - User ID (email)
 * @returns {Promise<TableData[]>} Array of table data summaries
 */
export async function getUserTablesWithData(userId: string): Promise<TableData[]> {
  const tables: TableData[] = [];

  // Check parent tables
  for (const table of USER_TABLES) {
    try {
      const data = await getUserTableData(userId, table.name);
      tables.push({
        tableName: table.name,
        records: data,
        recordCount: data.length,
      });
    } catch (error) {
      logger.dev(`[Backup Export] Skipping table ${table.name}:`, error);
    }
  }

  // Check child tables
  for (const childTable of CHILD_TABLES) {
    try {
      // Get parent IDs
      const supabase = createSupabaseAdmin();
      const { data: parentData } = await supabase
        .from(childTable.parentTable)
        .select(childTable.parentIdColumn)
        .eq('user_id', userId);

      const parentIds = (parentData || [])
        .map((row: any) => row[childTable.parentIdColumn])
        .filter(Boolean);

      if (parentIds.length > 0) {
        const childData = await getChildTableData(childTable.name, childTable.fk, parentIds);
        tables.push({
          tableName: childTable.name,
          records: childData,
          recordCount: childData.length,
        });
      }
    } catch (error) {
      logger.dev(`[Backup Export] Skipping child table ${childTable.name}:`, error);
    }
  }

  return tables;
}
