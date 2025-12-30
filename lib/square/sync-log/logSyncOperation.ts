/**
 * Log a sync operation.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import type { SyncOperation, SyncLog } from './types';

/**
 * Log a sync operation.
 */
export async function logSyncOperation(operation: SyncOperation): Promise<SyncLog> {
  if (!supabaseAdmin) {
    logger.error('[Square Sync Log] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const logData = {
      user_id: operation.user_id,
      operation_type: operation.operation_type,
      direction: operation.direction,
      entity_type: operation.entity_type || null,
      entity_id: operation.entity_id || null,
      square_id: operation.square_id || null,
      status: operation.status,
      error_message: operation.error_message || null,
      error_details: operation.error_details || null,
      sync_metadata: operation.sync_metadata || null,
      retry_count: operation.retry_count || 0,
      max_retries: operation.max_retries || 5,
      next_retry_at: operation.next_retry_at || null,
    };

    const { data, error } = await supabaseAdmin
      .from('square_sync_logs')
      .insert(logData)
      .select()
      .single();

    if (error) {
      logger.error('[Square Sync Log] Error logging sync operation:', {
        error: error.message,
        code: (error as any).code,
        operation,
        context: { endpoint: 'logSyncOperation', operation: 'insert' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    return data as SyncLog;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Sync Log] Unexpected error logging sync operation:', {
      error: error.message,
      operation,
      context: { endpoint: 'logSyncOperation', operation: 'insert' },
    });

    throw ApiErrorHandler.createError('Failed to log sync operation', 'DATABASE_ERROR', 500);
  }
}




