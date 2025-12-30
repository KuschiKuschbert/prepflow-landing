/**
 * Common helpers for catalog sync operations.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { logSyncOperation } from '../../../sync-log';

/**
 * Update last catalog sync timestamp
 */
export async function updateLastCatalogSyncTimestamp(userId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.warn('[Square Catalog Sync] Supabase not available, cannot update sync timestamp');
    return;
  }

  const { error } = await supabaseAdmin
    .from('square_configurations')
    .update({
      last_menu_sync_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    logger.warn('[Square Catalog Sync] Failed to update last sync timestamp:', {
      error: error.message,
      userId,
    });
  }
}

/**
 * Log sync operation for catalog
 */
export async function logCatalogSyncOperation(params: {
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
    operation_type: 'sync_catalog',
    direction: params.direction,
    entity_type: 'dish',
    entity_id: params.entityId,
    square_id: params.squareId,
    status: params.status,
    error_message: params.errorMessage,
    error_details: params.errorDetails,
  });
}
