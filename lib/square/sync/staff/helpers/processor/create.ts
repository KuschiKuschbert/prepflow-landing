import { logger } from '@/lib/logger';
import { createAutoMapping } from '../../../../mappings';
import type { Employee, SyncResult } from '../../../staff';
import { logStaffSyncOperation } from '../common';
import type { TeamApi } from './types';

export async function createSquareTeamMember(
  userId: string,
  employee: Employee,
  teamMemberData: unknown,
  teamApi: TeamApi,
  result: SyncResult,
): Promise<void> {
  // Create new Square team member
  const createResponse = await teamApi.createTeamMember({
    idempotencyKey: `${employee.id}-${Date.now()}`,
    teamMember: teamMemberData,
  });

  if (createResponse.result?.teamMember && createResponse.result?.teamMember.id) {
    const squareTeamMemberId = createResponse.result.teamMember.id;

    // Create mapping
    const newMapping = await createAutoMapping(
      employee.id,
      squareTeamMemberId,
      'employee',
      userId,
    );

    if (!newMapping) {
      logger.error('[Square Staff Sync] Error creating mapping:', {
        employeeId: employee.id,
        squareTeamMemberId,
      });
      result.errors++;
      result.errorMessages?.push(`Failed to create mapping for employee ${employee.id}`);
      return;
    }

    result.created++;
    result.synced++;

    // Log sync operation
    await logStaffSyncOperation({
      userId,
      direction: 'prepflow_to_square',
      entityId: employee.id,
      squareId: squareTeamMemberId,
      status: 'success',
    });
  } else {
    logger.error('[Square Staff Sync] Failed to create Square team member:', {
      employeeId: employee.id,
    });
    result.errors++;
    result.errorMessages?.push(`Failed to create Square team member for employee ${employee.id}`);
  }
}
