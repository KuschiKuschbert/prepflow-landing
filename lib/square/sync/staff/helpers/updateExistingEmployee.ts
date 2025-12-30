/**
 * Update existing employee from Square team member.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { logStaffSyncOperation } from './common';
import type { SyncResult } from '../../staff';

export async function updateExistingEmployee(
  mapping: any,
  employeeData: any,
  squareTeamMemberId: string,
  userId: string,
  result: SyncResult,
): Promise<void> {
  if (!supabaseAdmin) {
    return;
  }

  const { error: updateError } = await supabaseAdmin
    .from('employees')
    .update({
      full_name: employeeData.full_name,
      role: employeeData.role,
      employment_start_date: employeeData.employment_start_date,
      employment_end_date: employeeData.employment_end_date,
      status: employeeData.status,
      phone: employeeData.phone,
      email: employeeData.email,
      emergency_contact: employeeData.emergency_contact,
      photo_url: employeeData.photo_url,
      notes: employeeData.notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', mapping.prepflow_id);

  if (updateError) {
    logger.error('[Square Staff Sync] Error updating employee:', {
      error: updateError.message,
      employeeId: mapping.prepflow_id,
      squareTeamMemberId,
    });
    result.errors++;
    result.errorMessages?.push(
      `Failed to update employee ${mapping.prepflow_id}: ${updateError.message}`,
    );
    return;
  }

  const { error: updateMappingError } = await supabaseAdmin
    .from('square_mappings')
    .update({
      last_synced_at: new Date().toISOString(),
      last_synced_from_square: new Date().toISOString(),
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

  await logStaffSyncOperation({
    userId,
    direction: 'square_to_prepflow',
    entityId: mapping.prepflow_id,
    squareId: squareTeamMemberId,
    status: 'success',
  });
}



