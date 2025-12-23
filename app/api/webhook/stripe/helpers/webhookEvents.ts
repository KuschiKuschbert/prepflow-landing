import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Check if webhook event has already been processed (idempotency)
 */
export async function isWebhookEventProcessed(eventId: string): Promise<boolean> {
  if (!supabaseAdmin) return false;

  const { data, error } = await supabaseAdmin
    .from('webhook_events')
    .select('processed')
    .eq('stripe_event_id', eventId)
    .maybeSingle();

  if (error) {
    logger.warn('[Webhook Events] Error checking if event is processed:', {
      error: error.message,
      eventId,
    });
    return false;
  }

  return data?.processed === true;
}

/**
 * Mark webhook event as processed
 */
export async function markWebhookEventProcessed(
  eventId: string,
  eventType: string,
  success: boolean,
  processingTimeMs: number,
  errorMessage?: string,
  eventData?: any,
): Promise<void> {
  if (!supabaseAdmin) return;

  const { error } = await supabaseAdmin.from('webhook_events').upsert(
    {
      stripe_event_id: eventId,
      event_type: eventType,
      processed: true,
      processed_at: new Date().toISOString(),
      processing_time_ms: processingTimeMs,
      success,
      error_message: errorMessage || null,
      event_data: eventData || null,
    },
    { onConflict: 'stripe_event_id' },
  );

  if (error) {
    logger.error('[Webhook Events] Failed to mark event as processed:', {
      error: error.message,
      eventId,
      eventType,
    });
  }
}

/**
 * Get webhook secret based on environment
 * Supports both single secret and environment-specific secrets (dev/prod)
 * Stripe best practice: Use different webhook secrets for dev and production
 */
export function getWebhookSecret(): string | null {
  // Try environment-specific secret first (best practice)
  const envSpecificSecret =
    process.env.NODE_ENV === 'production'
      ? process.env.STRIPE_WEBHOOK_SECRET_PROD
      : process.env.STRIPE_WEBHOOK_SECRET_DEV;

  // Fallback to single secret (backward compatibility)
  return envSpecificSecret || process.env.STRIPE_WEBHOOK_SECRET || null;
}
