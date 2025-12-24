import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { TableData } from '../../types';
import { getUserTableData, getChildTableData } from './fetchTableData';
import { USER_TABLES, CHILD_TABLES } from './tableConfig';

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
      const { data: parentData, error: parentError } = await supabase
        .from(childTable.parentTable)
        .select(childTable.parentIdColumn)
        .eq('user_id', userId);

      if (parentError) {
        logger.warn(`[Backup Export] Error fetching parent data for ${childTable.name}:`, {
          error: parentError.message,
          tableName: childTable.parentTable,
        });
        continue;
      }

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
