/**
 * Process Square team members for sync to PrepFlow.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getMappingBySquareId } from '../../../mappings';
import { mapSquareTeamMemberToEmployee } from './mapping';
import { logStaffSyncOperation } from './common';
import { updateExistingEmployee } from './updateExistingEmployee';
import { createNewEmployee } from './createNewEmployee';
import type { SyncResult } from '../../staff';

/**
 * Process a single Square team member for sync to PrepFlow
 */
export async function processSquareTeamMember(
  teamMember: any,
  userId: string,
  result: SyncResult,
): Promise<void> {
  if (!supabaseAdmin) {
    result.errorMessages?.push('Database connection not available');
    return;
  }

  try {
    if (!teamMember.id) {
      return;
    }

    const squareTeamMemberId = teamMember.id;
    const mapping = await getMappingBySquareId(squareTeamMemberId, 'employee', userId);
    const employeeData = mapSquareTeamMemberToEmployee(teamMember);

    if (mapping) {
      await updateExistingEmployee(mapping, employeeData, squareTeamMemberId, userId, result);
    } else {
      await createNewEmployee(employeeData, squareTeamMemberId, userId, result);
    }
  } catch (memberError: any) {
    logger.error('[Square Staff Sync] Error processing Square team member:', {
      error: memberError.message,
      squareTeamMemberId: teamMember.id,
    });
    result.errors++;
    result.errorMessages?.push(
      `Failed to process Square team member ${teamMember.id}: ${memberError.message}`,
    );

    await logStaffSyncOperation({
      userId,
      direction: 'square_to_prepflow',
      squareId: teamMember.id,
      status: 'error',
      errorMessage: memberError.message,
      errorDetails: { stack: memberError.stack },
    });
  }
}
