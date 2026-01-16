/**
 * Sync team members from Square to PrepFlow.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getSquareClient } from '../../client';
import { getSquareConfig } from '../../config';
import { logSyncOperation } from '../../sync-log';
import type { SyncResult } from '../staff';
import { updateLastStaffSyncTimestamp } from './helpers/common';
import { processSquareTeamMember } from './helpers/processFromSquare';

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

    // Fetch Square team members
    const teamApi = client.team;
    // Type assertion for Square SDK method until stricter types are available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listResponse = await (teamApi as any).searchTeamMembers({
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
      await processSquareTeamMember(teamMember, userId, result);
    }

    // Update last sync timestamp
    await updateLastStaffSyncTimestamp(userId);

    result.success = result.errors === 0;
    return result;
  } catch (error: unknown) {
    logger.error('[Square Staff Sync] Fatal error:', {
      error: error instanceof Error ? error.message : String(error),
      userId,
      stack: error instanceof Error ? error.stack : undefined,
    });

    result.errorMessages?.push(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);

    await logSyncOperation({
      user_id: userId,
      operation_type: 'sync_staff',
      direction: 'square_to_prepflow',
      status: 'error',
      error_message: error instanceof Error ? error.message : String(error),
      error_details: { stack: error instanceof Error ? error.stack : undefined },
    });

    return result;
  }
}
