/**
 * Retry processing a failed webhook event.
 */
import { supabaseAdmin } from '../../supabase';
import { logger } from '../../logger';

/**
 * Retry processing a failed webhook event.
 * Useful for admin recovery operations.
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
