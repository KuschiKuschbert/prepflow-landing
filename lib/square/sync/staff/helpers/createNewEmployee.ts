/**
 * Create new employee from Square team member.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { createAutoMapping } from '../../../mappings';
import { logStaffSyncOperation } from './common';
import type { SyncResult } from '../../staff';

export async function createNewEmployee(
  employeeData: any,
  squareTeamMemberId: string,
  userId: string,
  result: SyncResult,
): Promise<void> {
  if (!supabaseAdmin) {
    return;
  }

  const { data: newEmployee, error: createError } = await supabaseAdmin
    .from('employees')
    .insert({
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
    })
    .select()
    .single();

  if (createError || !newEmployee) {
    logger.error('[Square Staff Sync] Error creating employee:', {
      error: createError?.message,
      squareTeamMemberId,
    });
    result.errors++;
    result.errorMessages?.push(
      `Failed to create employee: ${createError?.message || 'Unknown error'}`,
    );
    return;
  }

  const newMapping = await createAutoMapping(
    newEmployee.id,
    squareTeamMemberId,
    'employee',
    userId,
  );

  if (!newMapping) {
    logger.error('[Square Staff Sync] Error creating mapping:', {
      employeeId: newEmployee.id,
      squareTeamMemberId,
    });
    result.errors++;
    result.errorMessages?.push(`Failed to create mapping for employee ${newEmployee.id}`);
    return;
  }

  result.created++;
  result.synced++;

  await logStaffSyncOperation({
    userId,
    direction: 'square_to_prepflow',
    entityId: newEmployee.id,
    squareId: squareTeamMemberId,
    status: 'success',
  });
}



