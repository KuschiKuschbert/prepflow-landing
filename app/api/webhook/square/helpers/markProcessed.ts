import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { logSyncOperation } from '@/lib/square/sync-log';

interface MarkProcessedParams {
  eventId: string;
  eventType: string;
  userId: string;
  success: boolean;
  processingTimeMs: number;
  errorMessage?: string;
  eventData?: any;
}

/**
 * Mark webhook event as processed
 * Uses square_sync_logs table to track processed webhook events
 *
 * @param {MarkProcessedParams} params - Parameters for marking event processed
 */
export async function markWebhookEventProcessed(params: MarkProcessedParams): Promise<void> {
  const { eventId, eventType, userId, success, processingTimeMs, errorMessage, eventData } = params;

  if (!supabaseAdmin) {
    logger.error('[Square Webhook] Cannot mark event processed - database not available');
    return;
  }

  try {
    await logSyncOperation({
      user_id: userId,
      operation_type: 'webhook_event',
      direction: 'square_to_prepflow', // Webhooks are always Square → PrepFlow
      status: success ? 'success' : 'error',
      error_message: errorMessage,
      error_details: { processingTimeMs },
      sync_metadata: {
        event_id: eventId,
        event_type: eventType,
        event_data: eventData,
      },
    });
  } catch (error: any) {
    logger.error('[Square Webhook] Error marking event processed:', {
      error: error.message,
      eventId,
      userId,
    });
  }
}


