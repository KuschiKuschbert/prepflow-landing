import { supabaseAdmin } from './supabase';
import { logger } from './logger';

export interface WebhookEventLog {
  stripe_event_id: string;
  event_type: string;
  processed: boolean;
  processed_at?: Date;
  processing_time_ms?: number;
  success?: boolean;
  error_message?: string;
  event_data?: any;
}

/**
 * Log webhook event to database for tracking and debugging.
 *
 * @param {WebhookEventLog} logData - Event log data
 * @returns {Promise<boolean>} True if logged successfully
 */
export async function logWebhookEvent(logData: WebhookEventLog): Promise<boolean> {
  if (!supabaseAdmin) {
    logger.warn('[Webhook Logger] Supabase not available, cannot log event');
    return false;
  }

  try {
    const { error } = await supabaseAdmin.from('webhook_events').upsert(
      {
        stripe_event_id: logData.stripe_event_id,
        event_type: logData.event_type,
        processed: logData.processed,
        processed_at: logData.processed_at?.toISOString() || null,
        processing_time_ms: logData.processing_time_ms || null,
        success: logData.success || null,
        error_message: logData.error_message || null,
        event_data: logData.event_data || null,
      },
      { onConflict: 'stripe_event_id' },
    );

    if (error) {
      logger.error('[Webhook Logger] Failed to log webhook event:', {
        error: error.message,
        eventId: logData.stripe_event_id,
      });
      return false;
    }

    return true;
  } catch (error) {
    logger.error('[Webhook Logger] Unexpected error logging webhook event:', {
      error: error instanceof Error ? error.message : String(error),
      eventId: logData.stripe_event_id,
    });
    return false;
  }
}

/**
 * Get webhook event logs for admin dashboard.
 *
 * @param {Object} options - Query options
 * @param {number} [options.limit=100] - Maximum number of events to return
 * @param {string} [options.eventType] - Filter by event type
 * @param {boolean} [options.processed] - Filter by processed status
 * @returns {Promise<WebhookEventLog[]>} Array of webhook event logs
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

/**
 * Retry processing a failed webhook event.
 * Useful for admin recovery operations.
 *
 * @param {string} eventId - Stripe event ID to retry
 * @returns {Promise<boolean>} True if retry successful
 */
export async function retryWebhookEvent(eventId: string): Promise<boolean> {
  if (!supabaseAdmin) {
    logger.warn('[Webhook Logger] Supabase not available');
    return false;
  }

  try {
    // Get event data
    const { data: eventData, error: fetchError } = await supabaseAdmin
      .from('webhook_events')
      .select('event_data, event_type')
      .eq('stripe_event_id', eventId)
      .single();

    if (fetchError || !eventData) {
      logger.error('[Webhook Logger] Failed to fetch event for retry:', {
        error: fetchError?.message,
        eventId,
      });
      return false;
    }

    // Mark as unprocessed so webhook handler can retry
    const { error: updateError } = await supabaseAdmin
      .from('webhook_events')
      .update({
        processed: false,
        processed_at: null,
        success: null,
        error_message: null,
      })
      .eq('stripe_event_id', eventId);

    if (updateError) {
      logger.error('[Webhook Logger] Failed to mark event for retry:', {
        error: updateError.message,
        eventId,
      });
      return false;
    }

    logger.info('[Webhook Logger] Marked event for retry:', { eventId });
    return true;
  } catch (error) {
    logger.error('[Webhook Logger] Unexpected error retrying webhook event:', {
      error: error instanceof Error ? error.message : String(error),
      eventId,
    });
    return false;
  }
}
