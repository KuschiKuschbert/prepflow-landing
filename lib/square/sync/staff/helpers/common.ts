/**
 * Common helpers for staff sync operations.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { logSyncOperation } from '../../../sync-log';

/**
 * Update last staff sync timestamp
 */
export async function updateLastStaffSyncTimestamp(userId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.warn('[Square Staff Sync] Supabase not available, cannot update sync timestamp');
    return;
  }

  const { error } = await supabaseAdmin
    .from('square_configurations')
    .update({
      last_staff_sync_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    logger.warn('[Square Staff Sync] Failed to update last sync timestamp:', {
      error: error.message,
      userId,
    });
  }
}

/**
 * Log sync operation for staff
 */
export async function logStaffSyncOperation(params: {
  userId: string;
  direction: 'square_to_prepflow' | 'prepflow_to_square';
  entityId?: string;
  squareId?: string;
  status: 'success' | 'error';
  errorMessage?: string;
  errorDetails?: Record<string, any>;
}): Promise<void> {
  await logSyncOperation({
    user_id: params.userId,
    operation_type: 'sync_staff',
    direction: params.direction,
    entity_type: 'employee',
    entity_id: params.entityId,
    square_id: params.squareId,
    status: params.status,
    error_message: params.errorMessage,
    error_details: params.errorDetails,
  });
}


