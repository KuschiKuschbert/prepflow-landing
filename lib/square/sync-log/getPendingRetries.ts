/**
 * Get pending retry operations.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { SyncLog } from './types';

/**
 * Get pending retry operations.
 * Returns sync logs that need to be retried.
 */
export async function getPendingRetries(userId: string): Promise<SyncLog[]> {
  if (!supabaseAdmin) {
    return [];
  }

  try {
    const now = new Date().toISOString();

    // Fetch retrying logs with next_retry_at <= now
    // Note: We can't compare retry_count < max_retries directly in Supabase query builder
    // So we fetch all retrying items and filter in JavaScript
    const { data, error } = await supabaseAdmin
      .from('square_sync_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'retrying')
      .lte('next_retry_at', now)
      .order('next_retry_at', { ascending: true });

    // Filter to only include items where retry_count < max_retries
    const filteredData = (data || []).filter((log: any) => {
      const retryCount = log.retry_count || 0;
      const maxRetries = log.max_retries || 5;
      return retryCount < maxRetries;
    });

    if (error) {
      logger.error('[Square Sync Log] Error fetching pending retries:', {
        error: error.message,
        code: (error as any).code,
        userId,
        context: { endpoint: 'getPendingRetries', operation: 'select' },
      });
      return [];
    }

    return filteredData as SyncLog[];
  } catch (error: any) {
    logger.error('[Square Sync Log] Unexpected error fetching pending retries:', {
      error: error.message,
      userId,
      context: { endpoint: 'getPendingRetries', operation: 'select' },
    });
    return [];
  }
}


