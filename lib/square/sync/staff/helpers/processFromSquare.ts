/**
 * Process Square team members for sync to PrepFlow.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getMappingBySquareId } from '../../../mappings';
import type { SyncResult } from '../../staff';
import { logStaffSyncOperation } from './common';
import { createNewEmployee } from './createNewEmployee';
import { mapSquareTeamMemberToEmployee } from './mapping';
import { updateExistingEmployee } from './updateExistingEmployee';

/**
 * Process a single Square team member for sync to PrepFlow
 */
export async function processSquareTeamMember(
  teamMember: { id?: string }, // Minimal type for what we access
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
  } catch (memberError: unknown) {
    logger.error('[Square Staff Sync] Error processing Square team member:', {
      error: memberError instanceof Error ? memberError.message : String(memberError),
      squareTeamMemberId: teamMember.id,
    });
    result.errors++;
    result.errorMessages?.push(
      `Failed to process Square team member ${teamMember.id}: ${memberError instanceof Error ? memberError.message : String(memberError)}`,
    );

    await logStaffSyncOperation({
      userId,
      direction: 'square_to_prepflow',
      squareId: teamMember.id,
      status: 'error',
      errorMessage: memberError instanceof Error ? memberError.message : String(memberError),
      errorDetails: { stack: memberError instanceof Error ? memberError.stack : undefined },
    });
  }
}
