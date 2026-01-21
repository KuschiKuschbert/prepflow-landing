/**
 * Process PrepFlow employees for sync to Square.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getMappingByPrepFlowId } from '../../../mappings';
import type { Employee, SyncResult } from '../../staff';
import { logStaffSyncOperation } from './common';
import { mapEmployeeToSquareTeamMember } from './mapping';
import { createSquareTeamMember } from './processor/create';
import type { TeamApi } from './processor/types';
import { updateSquareTeamMember } from './processor/update';

export type { TeamApi };

export async function processPrepFlowEmployee(
  employee: Employee,
  userId: string,
  teamApi: TeamApi,
  result: SyncResult,
): Promise<void> {
  if (!supabaseAdmin) {
    result.errorMessages?.push('Database connection not available');
    return;
  }

  try {
    // Check if mapping exists
    const mapping = await getMappingByPrepFlowId(employee.id, 'employee', userId);

    // Map PrepFlow employee to Square team member
    const teamMemberData = mapEmployeeToSquareTeamMember(employee);

    if (mapping) {
      await updateSquareTeamMember(userId, employee, mapping, teamMemberData, teamApi, result);
    } else {
      await createSquareTeamMember(userId, employee, teamMemberData, teamApi, result);
    }
  } catch (employeeError: unknown) {
    const errorMessage =
      employeeError instanceof Error ? employeeError.message : String(employeeError);
    const stack = employeeError instanceof Error ? employeeError.stack : undefined;

    logger.error('[Square Staff Sync] Error processing employee:', {
      error: errorMessage,
      employeeId: employee.id,
    });
    result.errors++;
    result.errorMessages?.push(`Failed to process employee ${employee.id}: ${errorMessage}`);

    await logStaffSyncOperation({
      userId,
      direction: 'prepflow_to_square',
      entityId: employee.id,
      status: 'error',
      errorMessage: errorMessage,
      errorDetails: { stack },
    });
  }
}
