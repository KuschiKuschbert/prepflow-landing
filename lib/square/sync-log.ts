/**
 * Sync log service for operation logging and audit trail.
 * Tracks all sync operations, errors, and retry attempts.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Database Schema, Sync Operations sections) for
 * detailed sync logging documentation and usage examples.
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

export interface SyncLog {
  id: string;
  user_id: string;
  operation_type: 'sync_catalog' | 'sync_orders' | 'sync_staff' | 'sync_costs' | 'initial_sync';
  direction: 'square_to_prepflow' | 'prepflow_to_square' | 'bidirectional';
  entity_type: string | null;
  entity_id: string | null;
  square_id: string | null;
  status: 'success' | 'error' | 'conflict' | 'skipped' | 'pending' | 'retrying';
  error_message: string | null;
  error_details: Record<string, any> | null;
  sync_metadata: Record<string, any> | null;
  retry_count: number;
  max_retries: number;
  next_retry_at: string | null;
  created_at: string;
}

export interface SyncOperation {
  user_id: string;
  operation_type: 'sync_catalog' | 'sync_orders' | 'sync_staff' | 'sync_costs' | 'initial_sync';
  direction: 'square_to_prepflow' | 'prepflow_to_square' | 'bidirectional';
  entity_type?: string;
  entity_id?: string;
  square_id?: string;
  status: 'success' | 'error' | 'conflict' | 'skipped' | 'pending' | 'retrying';
  error_message?: string;
  error_details?: Record<string, any>;
  sync_metadata?: Record<string, any>;
  retry_count?: number;
  max_retries?: number;
  next_retry_at?: string | null;
}

/**
 * Log a sync operation.
 *
 * @param {SyncOperation} operation - Sync operation details
 * @returns {Promise<SyncLog>} Created sync log entry
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
      logger.error('[square/sync-log] Database error:', {
        error: error.message,
      });
      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

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

/**
 * Get sync history for a user.
 *
 * @param {string} userId - User ID
 * @param {number} [limit] - Maximum number of logs to return (default: 100)
 * @param {string} [operationType] - Optional operation type filter
 * @param {string} [status] - Optional status filter
 * @returns {Promise<SyncLog[]>} List of sync logs
 */
export async function getSyncHistory(
  userId: string,
  limit: number = 100,
  operationType?: string,
  status?: string,
): Promise<SyncLog[]> {
  if (!supabaseAdmin) {
    return [];
  }

  try {
    let query = supabaseAdmin
      .from('square_sync_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (operationType) {
      query = query.eq('operation_type', operationType);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[Square Sync Log] Error fetching sync history:', {
        error: error.message,
        code: (error as any).code,
        userId,
        limit,
        operationType,
        status,
        context: { endpoint: 'getSyncHistory', operation: 'select' },
      });
      return [];
    }

    return (data || []) as SyncLog[];
  } catch (error: any) {
    logger.error('[Square Sync Log] Unexpected error fetching sync history:', {
      error: error.message,
      userId,
      limit,
      operationType,
      status,
      context: { endpoint: 'getSyncHistory', operation: 'select' },
    });
    return [];
  }
}

/**
 * Get sync errors for a user.
 *
 * @param {string} userId - User ID
 * @param {number} [days] - Number of days to look back (default: 7)
 * @returns {Promise<SyncLog[]>} List of error logs
 */
export async function getSyncErrors(userId: string, days: number = 7): Promise<SyncLog[]> {
  if (!supabaseAdmin) {
    return [];
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data, error } = await supabaseAdmin
      .from('square_sync_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'error')
      .gte('created_at', cutoffDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('[Square Sync Log] Error fetching sync errors:', {
        error: error.message,
        code: (error as any).code,
        userId,
        days,
        context: { endpoint: 'getSyncErrors', operation: 'select' },
      });
      return [];
    }

    return (data || []) as SyncLog[];
  } catch (error: any) {
    logger.error('[Square Sync Log] Unexpected error fetching sync errors:', {
      error: error.message,
      userId,
      days,
      context: { endpoint: 'getSyncErrors', operation: 'select' },
    });
    return [];
  }
}

/**
 * Get pending retry operations.
 * Returns sync logs that need to be retried.
 *
 * @param {string} userId - User ID
 * @returns {Promise<SyncLog[]>} List of pending retry logs
 */
export async function getPendingRetries(userId: string): Promise<SyncLog[]> {
  if (!supabaseAdmin) {
    return [];
  }

  try {
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('square_sync_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'retrying')
      .lte('next_retry_at', now)
      .lt('retry_count', supabaseAdmin.raw('max_retries'))
      .order('next_retry_at', { ascending: true });

    if (error) {
      logger.error('[Square Sync Log] Error fetching pending retries:', {
        error: error.message,
        code: (error as any).code,
        userId,
        context: { endpoint: 'getPendingRetries', operation: 'select' },
      });
      return [];
    }

    return (data || []) as SyncLog[];
  } catch (error: any) {
    logger.error('[Square Sync Log] Unexpected error fetching pending retries:', {
      error: error.message,
      userId,
      context: { endpoint: 'getPendingRetries', operation: 'select' },
    });
    return [];
  }
}

/**
 * Update sync log retry information.
 *
 * @param {string} logId - Log ID
 * @param {object} retryInfo - Retry information
 * @returns {Promise<void>}
 */
export async function updateSyncLogRetry(
  logId: string,
  retryInfo: {
    retry_count: number;
    next_retry_at: string | null;
    status?: 'retrying' | 'error';
  },
): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const updateData: any = {
      retry_count: retryInfo.retry_count,
      next_retry_at: retryInfo.next_retry_at,
    };

    if (retryInfo.status) {
      updateData.status = retryInfo.status;
    }

    const { error } = await supabaseAdmin
      .from('square_sync_logs')
      .update(updateData)
      .eq('id', logId);

    if (error) {
      logger.error('[Square Sync Log] Error updating retry info:', {
        error: error.message,
        code: (error as any).code,
        logId,
        retryInfo,
        context: { endpoint: 'updateSyncLogRetry', operation: 'update' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Sync Log] Unexpected error updating retry info:', {
      error: error.message,
      logId,
      retryInfo,
      context: { endpoint: 'updateSyncLogRetry', operation: 'update' },
    });

    throw ApiErrorHandler.createError('Failed to update retry info', 'DATABASE_ERROR', 500);
  }
}
