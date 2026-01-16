/**
 * Sync employees from PrepFlow to Square.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getSquareClient } from '../../client';
import { getSquareConfig } from '../../config';
import { logSyncOperation } from '../../sync-log';
import type { SyncResult } from '../staff';
import { updateLastStaffSyncTimestamp } from './helpers/common';
import { processPrepFlowEmployee } from './helpers/processToSquare';

/**
 * Sync employees from PrepFlow to Square
 * Creates or updates Square team members based on PrepFlow employees
 */
export async function syncStaffToSquare(
  userId: string,
  employeeIds?: string[],
): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    synced: 0,
    created: 0,
    updated: 0,
    errors: 0,
    errorMessages: [],
  };

  if (!supabaseAdmin) {
    result.errorMessages?.push('Database connection not available');
    return result;
  }

  try {
    const client = await getSquareClient(userId);
    if (!client) {
      throw new Error('Square client not available');
    }

    const config = await getSquareConfig(userId);
    if (!config) {
      throw new Error('Square configuration not found');
    }

    // Fetch PrepFlow employees
    let query = supabaseAdmin.from('employees').select('*');

    if (employeeIds && employeeIds.length > 0) {
      query = query.in('id', employeeIds);
    } else {
      // Only sync active employees by default
      query = query.eq('status', 'active');
    }

    const { data: employees, error: employeesError } = await query;

    if (employeesError) {
      logger.error('[Square Staff Sync] Failed to fetch employees:', {
        error: employeesError.message,
        userId,
      });
      result.errorMessages?.push(`Failed to fetch employees: ${employeesError.message}`);
      result.errors++;
      return result;
    }

    if (!employees || employees.length === 0) {
      logger.warn('[Square Staff Sync] No employees found in PrepFlow');
      result.success = true;
      return result;
    }

    logger.dev('[Square Staff Sync] Found PrepFlow employees:', {
      count: employees.length,
      userId,
    });

    const teamApi = client.team;

    // Process each employee
    for (const employee of employees) {
      await processPrepFlowEmployee(employee, userId, teamApi, result);
    }

    // Update last sync timestamp
    await updateLastStaffSyncTimestamp(userId);

    result.success = result.errors === 0;
    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    logger.error('[Square Staff Sync] Fatal error:', {
      error: errorMessage,
      userId,
      stack: errorStack,
    });

    result.errorMessages?.push(`Fatal error: ${errorMessage}`);

    await logSyncOperation({
      user_id: userId,
      operation_type: 'sync_staff',
      direction: 'prepflow_to_square',
      status: 'error',
      error_message: errorMessage,
      error_details: { stack: errorStack },
    });

    return result;
  }
}
