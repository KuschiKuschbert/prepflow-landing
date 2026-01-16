import { logger } from '@/lib/logger';
import { getChildTableData, getUserTableData } from './fetchTableData';
import { CHILD_TABLES, USER_TABLES } from './tableConfig';

/**
 * Fetch all table data for a user (parent and child tables).
 *
 * @param {string} userId - User ID (email)
 * @returns {Promise<{ tables: Record<string, any[]>, recordCounts: Record<string, number> }>} Tables data and counts
 */
export async function fetchAllTableData(
  userId: string,
): Promise<{
  tables: Record<string, Record<string, unknown>[]>;
  recordCounts: Record<string, number>;
}> {
  const tables: Record<string, Record<string, unknown>[]> = {};
  const recordCounts: Record<string, number> = {};

  // Export parent tables with user_id
  for (const table of USER_TABLES) {
    try {
      const data = await getUserTableData(userId, table.name);
      tables[table.name] = data;
      recordCounts[table.name] = data.length;
      logger.dev(`[Backup Export] Exported ${data.length} records from ${table.name}`);
    } catch (error) {
      logger.error(`[Backup Export] Failed to export ${table.name}:`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        context: { tableName: table.name, userId, operation: 'exportUserData' },
      });
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
        .map((row: Record<string, unknown>) => row[childTable.parentIdColumn])
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

  return { tables, recordCounts };
}
