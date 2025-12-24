/**
 * Process PrepFlow employees for sync to Square.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getMappingByPrepFlowId, createAutoMapping } from '../../../mappings';
import { mapEmployeeToSquareTeamMember } from './mapping';
import { logStaffSyncOperation } from './common';
import type { Employee, SyncResult } from '../../staff';

/**
 * Process a single PrepFlow employee for sync to Square
 */
export async function processPrepFlowEmployee(
  employee: Employee,
  userId: string,
  teamApi: any,
  result: SyncResult,
): Promise<void> {
  if (!supabaseAdmin) {
    result.errorMessages?.push('Database connection not available');
    return;
  }

  try {
    // Check if mapping exists
    let mapping = await getMappingByPrepFlowId(employee.id, 'employee', userId);

    // Map PrepFlow employee to Square team member
    const teamMemberData = mapEmployeeToSquareTeamMember(employee);

    if (mapping) {
      // Update existing Square team member
      const updateResponse = await (teamApi as any).updateTeamMember(mapping.square_id, {
        teamMember: teamMemberData,
      });

      if (updateResponse.result?.teamMember) {
        // Update mapping sync timestamp
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
        result.errorMessages?.push(
          `Failed to update Square team member for employee ${employee.id}`,
        );
      }
    } else {
      // Create new Square team member
      const createResponse = await (teamApi as any).createTeamMember({
        idempotencyKey: `${employee.id}-${Date.now()}`,
        teamMember: teamMemberData,
      });

      if (createResponse.result?.teamMember && createResponse.result.teamMember.id) {
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
        result.errorMessages?.push(
          `Failed to create Square team member for employee ${employee.id}`,
        );
      }
    }
  } catch (employeeError: any) {
    logger.error('[Square Staff Sync] Error processing employee:', {
      error: employeeError.message,
      employeeId: employee.id,
    });
    result.errors++;
    result.errorMessages?.push(
      `Failed to process employee ${employee.id}: ${employeeError.message}`,
    );

    await logStaffSyncOperation({
      userId,
      direction: 'prepflow_to_square',
      entityId: employee.id,
      status: 'error',
      errorMessage: employeeError.message,
      errorDetails: { stack: employeeError.stack },
    });
  }
}
