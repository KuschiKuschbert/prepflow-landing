import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { Employee, SyncResult } from '../../../staff';
import { logStaffSyncOperation } from '../common';
import type { TeamApi } from './types';

export async function updateSquareTeamMember(
  userId: string,
  employee: Employee,
  mapping: { id: string; square_id: string },
  teamMemberData: unknown,
  teamApi: TeamApi,
  result: SyncResult,
): Promise<void> {
  // Update existing Square team member
  const updateResponse = await teamApi.updateTeamMember(mapping.square_id, {
    teamMember: teamMemberData,
  });

  if (updateResponse.result?.teamMember) {
    // Update mapping sync timestamp
    if (supabaseAdmin) {
      const { error: updateMappingError } = await supabaseAdmin
        .from('square_mappings')
        .update({
          last_synced_at: new Date().toISOString(),
          last_synced_to_square: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', mapping.id);

      if (updateMappingError) {
        logger.warn('[Square Staff Sync] Failed to update mapping sync timestamp:', {
          error: updateMappingError.message,
          mappingId: mapping.id,
        });
      }
    }

    result.updated++;
    result.synced++;

    // Log sync operation
    await logStaffSyncOperation({
      userId,
      direction: 'prepflow_to_square',
      entityId: employee.id,
      squareId: mapping.square_id,
      status: 'success',
    });
  } else {
    logger.error('[Square Staff Sync] Failed to update Square team member:', {
      employeeId: employee.id,
      squareId: mapping.square_id,
    });
    result.errors++;
    result.errorMessages?.push(`Failed to update Square team member for employee ${employee.id}`);
  }
}
