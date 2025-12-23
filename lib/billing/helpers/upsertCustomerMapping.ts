import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Upsert customer mapping in database
 * Stripe best practice: Cache customer ID to reduce API calls
 *
 * @param userEmail - User email address
 * @param customerId - Stripe customer ID
 */
export async function upsertCustomerMapping(
  userEmail: string,
  customerId: string,
): Promise<void> {
  if (!supabaseAdmin) return;

  try {
    const { error } = await supabaseAdmin.from('billing_customers').upsert(
      {
        user_email: userEmail,
        stripe_customer_id: customerId,
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: 'user_email' },
    );

    if (error) {
      logger.error('[Billing] Failed to upsert customer mapping:', {
        error: error.message,
        email: userEmail,
        customerId,
      });
    }
  } catch (error) {
    logger.error('[Billing] Unexpected error upserting customer mapping:', {
      error: error instanceof Error ? error.message : String(error),
      email: userEmail,
      customerId,
    });
  }
}
