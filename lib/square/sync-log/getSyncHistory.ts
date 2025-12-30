/**
 * Get sync history for a user.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { SyncLog } from './types';

/**
 * Get sync history for a user.
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


