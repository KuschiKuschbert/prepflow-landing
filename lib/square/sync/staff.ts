/**
 * Staff/Employees Sync Service
 * Handles bidirectional synchronization between Square Team Members and PrepFlow Employees
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Sync Operations section) for
 * detailed sync operation documentation and usage examples.
 */

import { SquareClient } from 'square';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { getSquareClient } from '../client';
import { getSquareConfig } from '../config';
import { getMappingBySquareId, getMappingByPrepFlowId, createAutoMapping } from '../mappings';
import { logSyncOperation, SyncOperation } from '../sync-log';

export interface SyncResult {
  success: boolean;
  synced: number;
  created: number;
  updated: number;
  errors: number;
  errorMessages?: string[];
  metadata?: Record<string, any>;
}

export interface Employee {
  id: string;
  employee_id?: string | null;
  full_name: string;
  role?: string | null;
  employment_start_date: string;
  employment_end_date?: string | null;
  status: 'active' | 'inactive' | 'terminated';
  phone?: string | null;
  email?: string | null;
  emergency_contact?: string | null;
  photo_url?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Sync team members from Square to PrepFlow
 * Creates or updates employees based on Square team members
 */
export async function syncStaffFromSquare(userId: string): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    synced: 0,
    created: 0,
    updated: 0,
    errors: 0,
    errorMessages: [],
  };

  try {
    const client = await getSquareClient(userId);
    if (!client) {
      throw new Error('Square client not available');
    }

    const config = await getSquareConfig(userId);
    if (!config) {
      throw new Error('Square configuration not found');
    }

    // Fetch Square team members
    const teamApi = client.teamApi;
    const listResponse = await teamApi.searchTeamMembers({
      query: {
        filter: {
          status: 'ACTIVE', // Only sync active team members
        },
      },
    });

    if (!listResponse.result?.teamMembers) {
      logger.warn('[Square Staff Sync] No team members found in Square');
      result.success = true;
      return result;
    }

    const teamMembers = listResponse.result.teamMembers;
    logger.dev('[Square Staff Sync] Found Square team members:', {
      count: teamMembers.length,
      userId,
    });

    // Process each team member
    for (const teamMember of teamMembers) {
      try {
        if (!teamMember.id) {
          continue;
        }

        const squareTeamMemberId = teamMember.id;

        // Check if mapping exists
        let mapping = await getMappingBySquareId(squareTeamMemberId, 'employee', userId);

        // Map Square team member to PrepFlow employee
        const employeeData = mapSquareTeamMemberToEmployee(teamMember);

        if (mapping) {
          // Update existing employee
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
            continue;
          }

          // Update mapping sync timestamp
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
        } else {
          // Create new employee
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
            continue;
          }

          // Create mapping
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
            continue;
          }

          result.created++;
          result.synced++;
        }

        // Log sync operation
        await logSyncOperation({
          user_id: userId,
          operation_type: 'sync_staff',
          direction: 'square_to_prepflow',
          entity_type: 'employee',
          entity_id: mapping?.prepflow_id,
          square_id: squareTeamMemberId,
          status: 'success',
        });
      } catch (memberError: any) {
        logger.error('[Square Staff Sync] Error processing Square team member:', {
          error: memberError.message,
          squareTeamMemberId: teamMember.id,
        });
        result.errors++;
        result.errorMessages?.push(
          `Failed to process Square team member ${teamMember.id}: ${memberError.message}`,
        );

        await logSyncOperation({
          user_id: userId,
          operation_type: 'sync_staff',
          direction: 'square_to_prepflow',
          entity_type: 'employee',
          square_id: teamMember.id,
          status: 'error',
          error_message: memberError.message,
          error_details: { stack: memberError.stack },
        });
      }
    }

    // Update last sync timestamp
    await supabaseAdmin
      .from('square_configurations')
      .update({
        last_staff_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    result.success = result.errors === 0;
    return result;
  } catch (error: any) {
    logger.error('[Square Staff Sync] Fatal error:', {
      error: error.message,
      userId,
      stack: error.stack,
    });

    result.errorMessages?.push(`Fatal error: ${error.message}`);

    await logSyncOperation({
      user_id: userId,
      operation_type: 'sync_staff',
      direction: 'square_to_prepflow',
      status: 'error',
      error_message: error.message,
      error_details: { stack: error.stack },
    });

    return result;
  }
}

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

    const teamApi = client.teamApi;

    // Process each employee
    for (const employee of employees) {
      try {
        // Check if mapping exists
        let mapping = await getMappingByPrepFlowId(employee.id, 'employee', userId);

        // Map PrepFlow employee to Square team member
        const teamMemberData = mapEmployeeToSquareTeamMember(employee);

        if (mapping) {
          // Update existing Square team member
          const updateResponse = await teamApi.updateTeamMember(mapping.square_id, {
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
          } else {
            logger.error('[Square Staff Sync] Failed to update Square team member:', {
              employeeId: employee.id,
              squareId: mapping.square_id,
            });
            result.errors++;
            result.errorMessages?.push(`Failed to update Square team member for employee ${employee.id}`);
            continue;
          }
        } else {
          // Create new Square team member
          const createResponse = await teamApi.createTeamMember({
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
              continue;
            }

            result.created++;
            result.synced++;
          } else {
            logger.error('[Square Staff Sync] Failed to create Square team member:', {
              employeeId: employee.id,
            });
            result.errors++;
            result.errorMessages?.push(`Failed to create Square team member for employee ${employee.id}`);
            continue;
          }
        }

        // Log sync operation
        await logSyncOperation({
          user_id: userId,
          operation_type: 'sync_staff',
          direction: 'prepflow_to_square',
          entity_type: 'employee',
          entity_id: employee.id,
          square_id: mapping?.square_id,
          status: 'success',
        });
      } catch (employeeError: any) {
        logger.error('[Square Staff Sync] Error processing employee:', {
          error: employeeError.message,
          employeeId: employee.id,
        });
        result.errors++;
        result.errorMessages?.push(
          `Failed to process employee ${employee.id}: ${employeeError.message}`,
        );

        await logSyncOperation({
          user_id: userId,
          operation_type: 'sync_staff',
          direction: 'prepflow_to_square',
          entity_type: 'employee',
          entity_id: employee.id,
          status: 'error',
          error_message: employeeError.message,
          error_details: { stack: employeeError.stack },
        });
      }
    }

    // Update last sync timestamp
    const { error: updateTimestampError } = await supabaseAdmin
      .from('square_configurations')
      .update({
        last_staff_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateTimestampError) {
      logger.warn('[Square Staff Sync] Failed to update last sync timestamp:', {
        error: updateTimestampError.message,
        userId,
      });
    }

    result.success = result.errors === 0;
    return result;
  } catch (error: any) {
    logger.error('[Square Staff Sync] Fatal error:', {
      error: error.message,
      userId,
      stack: error.stack,
    });

    result.errorMessages?.push(`Fatal error: ${error.message}`);

    await logSyncOperation({
      user_id: userId,
      operation_type: 'sync_staff',
      direction: 'prepflow_to_square',
      status: 'error',
      error_message: error.message,
      error_details: { stack: error.stack },
    });

    return result;
  }
}

/**
 * Bidirectional staff sync
 * Syncs both directions based on sync direction configuration
 */
export async function syncStaffBidirectional(userId: string): Promise<SyncResult> {
  try {
    const config = await getSquareConfig(userId);
    if (!config) {
      logger.error('[Square Staff Sync] Square configuration not found for bidirectional sync:', {
        userId,
      });
      return {
        success: false,
        synced: 0,
        created: 0,
        updated: 0,
        errors: 1,
        errorMessages: ['Square configuration not found'],
      };
    }

    const syncDirection = config.auto_sync_direction || 'prepflow_to_square';

    if (syncDirection === 'bidirectional') {
      // Sync both directions
      const fromSquareResult = await syncStaffFromSquare(userId);
      const toSquareResult = await syncStaffToSquare(userId);

      return {
        success: fromSquareResult.success && toSquareResult.success,
        synced: fromSquareResult.synced + toSquareResult.synced,
        created: fromSquareResult.created + toSquareResult.created,
        updated: fromSquareResult.updated + toSquareResult.updated,
        errors: fromSquareResult.errors + toSquareResult.errors,
        errorMessages: [
          ...(fromSquareResult.errorMessages || []),
          ...(toSquareResult.errorMessages || []),
        ],
      };
    } else if (syncDirection === 'square_to_prepflow') {
      return await syncStaffFromSquare(userId);
    } else {
      // Default: prepflow_to_square
      return await syncStaffToSquare(userId);
    }
  } catch (error: any) {
    logger.error('[Square Staff Sync] Bidirectional sync error:', {
      error: error.message,
      userId,
    });

    return {
      success: false,
      synced: 0,
      created: 0,
      updated: 0,
      errors: 1,
      errorMessages: [error.message],
    };
  }
}

/**
 * Map Square team member to PrepFlow employee
 */
function mapSquareTeamMemberToEmployee(teamMember: any): Employee {
  // Extract name
  const givenName = teamMember.givenName || '';
  const familyName = teamMember.familyName || '';
  const fullName = `${givenName} ${familyName}`.trim() || teamMember.emailAddress?.emailAddress || 'Unknown';

  // Extract email
  const email = teamMember.emailAddress?.emailAddress || null;

  // Extract phone
  const phone = teamMember.phoneNumber?.phoneNumber || null;

  // Map Square status to PrepFlow status
  let status: 'active' | 'inactive' | 'terminated' = 'active';
  if (teamMember.status === 'INACTIVE') {
    status = 'inactive';
  } else if (teamMember.status === 'TERMINATED') {
    status = 'terminated';
  }

  // Extract role (from assignment or default)
  let role: string | null = null;
  if (teamMember.assignedLocations?.assignmentType) {
    // Map Square assignment type to role
    const assignmentType = teamMember.assignedLocations.assignmentType;
    if (assignmentType === 'MANAGER') {
      role = 'manager';
    } else if (assignmentType === 'EMPLOYEE') {
      role = 'staff';
    }
  }

  // Extract employment dates
  const employmentStartDate = teamMember.createdAt
    ? new Date(teamMember.createdAt).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];
  const employmentEndDate = status === 'terminated' ? employmentStartDate : null;

  return {
    id: '', // Will be set when creating employee
    full_name: fullName,
    role,
    employment_start_date: employmentStartDate,
    employment_end_date: employmentEndDate,
    status,
    phone,
    email,
    emergency_contact: null, // Square doesn't have emergency contact
    photo_url: null, // Square doesn't provide photo URL directly
    notes: null,
  };
}

/**
 * Map PrepFlow employee to Square team member
 */
function mapEmployeeToSquareTeamMember(employee: Employee): any {
  // Split full name into given and family name
  const nameParts = employee.full_name.split(' ');
  const givenName = nameParts[0] || '';
  const familyName = nameParts.slice(1).join(' ') || '';

  // Map PrepFlow status to Square status
  let status: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';
  if (employee.status === 'inactive' || employee.status === 'terminated') {
    status = 'INACTIVE';
  }

  // Build team member data
  const teamMemberData: any = {
    givenName,
    familyName,
    emailAddress: employee.email
      ? {
          emailAddress: employee.email,
        }
      : undefined,
    phoneNumber: employee.phone
      ? {
          phoneNumber: employee.phone,
        }
      : undefined,
    status,
  };

  // Add assignment if role exists
  if (employee.role) {
    // Map PrepFlow role to Square assignment type
    let assignmentType: 'EMPLOYEE' | 'MANAGER' = 'EMPLOYEE';
    if (employee.role.toLowerCase().includes('manager') || employee.role.toLowerCase().includes('admin')) {
      assignmentType = 'MANAGER';
    }

    // Note: Square requires location IDs for assignments
    // We'll need to get the default location from config
    // For now, we'll skip assignment and let Square handle it
    // TODO: Add location assignment based on config.default_location_id
  }

  return teamMemberData;
}
