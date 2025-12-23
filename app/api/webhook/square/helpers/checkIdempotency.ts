import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Check if webhook event has already been processed (idempotency)
 * Uses square_sync_logs table to track processed webhook events
 *
 * @param {string} eventId - Webhook event ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if event already processed
 */
export async function isWebhookEventProcessed(eventId: string, userId: string): Promise<boolean> {
  if (!supabaseAdmin) {
    return false;
  }

  try {
    // Check if we've already logged this webhook event
    // We use a special operation_type 'webhook_event' for webhook idempotency
    const { data, error } = await supabaseAdmin
      .from('square_sync_logs')
      .select('id')
      .eq('user_id', userId)
      .eq('operation_type', 'webhook_event')
      .eq('sync_metadata->>event_id', eventId)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is fine
      logger.error('[Square Webhook] Error checking event idempotency:', {
        error: error.message,
        eventId,
        userId,
      });
      return false;
    }

    return !!data;
  } catch (error: any) {
    logger.error('[Square Webhook] Unexpected error checking idempotency:', {
      error: error.message,
      eventId,
      userId,
    });
    return false;
  }
}

