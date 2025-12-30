/**
 * Log webhook event to database.
 */
import { supabaseAdmin } from '../../supabase';
import { logger } from '../../logger';
import type { WebhookEventLog } from '../types';

/**
 * Log webhook event to database for tracking and debugging.
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




