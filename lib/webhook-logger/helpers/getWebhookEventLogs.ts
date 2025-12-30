/**
 * Get webhook event logs for admin dashboard.
 */
import { supabaseAdmin } from '../../supabase';
import { logger } from '../../logger';
import type { WebhookEventLog } from '../types';

/**
 * Get webhook event logs for admin dashboard.
 */
export async function getWebhookEventLogs(
  options: {
    limit?: number;
    eventType?: string;
    processed?: boolean;
  } = {},
): Promise<WebhookEventLog[]> {
  if (!supabaseAdmin) {
    logger.warn('[Webhook Logger] Supabase not available');
    return [];
  }

  try {
    let query = supabaseAdmin
      .from('webhook_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(options.limit || 100);

    if (options.eventType) {
      query = query.eq('event_type', options.eventType);
    }

    if (options.processed !== undefined) {
      query = query.eq('processed', options.processed);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[Webhook Logger] Failed to fetch webhook event logs:', {
        error: error.message,
      });
      return [];
    }

    return (data || []).map(event => ({
      stripe_event_id: event.stripe_event_id,
      event_type: event.event_type,
      processed: event.processed,
      processed_at: event.processed_at ? new Date(event.processed_at) : undefined,
      processing_time_ms: event.processing_time_ms || undefined,
      success: event.success || undefined,
      error_message: event.error_message || undefined,
      event_data: event.event_data || undefined,
    }));
  } catch (error) {
    logger.error('[Webhook Logger] Unexpected error fetching webhook event logs:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}




