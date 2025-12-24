/**
 * Get sync errors for a user.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { SyncLog } from './types';

/**
 * Get sync errors for a user.
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
