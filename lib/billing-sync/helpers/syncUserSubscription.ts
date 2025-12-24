import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { TierSlug } from '@/lib/tier-config';
import { extractTierFromStripe } from '@/lib/webhook-helpers';
import type Stripe from 'stripe';

/**
 * Sync subscription data from Stripe to database.
 * Updates user subscription status, tier, and expiry dates.
 *
 * @param {string} userEmail - User email to sync
 * @returns {Promise<boolean>} True if sync successful
 */
export async function syncUserSubscription(userEmail: string): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe || !supabaseAdmin) {
    logger.warn('[Billing Sync] Stripe or Supabase not available');
    return false;
  }

  try {
    // Get user's Stripe customer ID
    const { data: billingData } = await supabaseAdmin
      .from('billing_customers')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('user_email', userEmail)
      .maybeSingle();

    if (!billingData?.stripe_customer_id) {
      logger.warn('[Billing Sync] No Stripe customer found for user:', userEmail);
      return false;
    }

    // Get active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: billingData.stripe_customer_id,
      status: 'all',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      logger.dev('[Billing Sync] No subscriptions found for user:', userEmail);
      return false;
    }

    const subscription = subscriptions.data[0] as unknown as Stripe.Subscription;

    // Extract tier
    const tier =
      extractTierFromStripe(subscription.items.data[0]?.price?.id, subscription.metadata) ||
      ('starter' as TierSlug);

    // Map status
    let status = 'active';
    if (subscription.status === 'past_due') status = 'past_due';
    else if (subscription.status === 'canceled' || subscription.status === 'unpaid')
      status = 'cancelled';
    else if (subscription.status === 'trialing') status = 'trial';
    else if (subscription.status === 'incomplete') status = 'trial';
    else if (subscription.status === 'incomplete_expired') status = 'cancelled';

    const expiresAt = (subscription as any).current_period_end
      ? new Date((subscription as any).current_period_end * 1000)
      : null;

    const currentPeriodStart = (subscription as any).current_period_start
      ? new Date((subscription as any).current_period_start * 1000)
      : null;

    // Update user subscription
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        subscription_tier: tier,
        subscription_status: status,
        subscription_expires: expiresAt?.toISOString() || null,
        subscription_cancel_at_period_end: subscription.cancel_at_period_end || false,
        subscription_current_period_start: currentPeriodStart?.toISOString() || null,
        stripe_subscription_id: subscription.id,
        updated_at: new Date().toISOString(),
      })
      .eq('email', userEmail);

    if (updateError) {
      logger.error('[Billing Sync] Failed to update user subscription:', {
        error: updateError.message,
        userEmail,
      });
      return false;
    }

    // Update billing_customers table
    await supabaseAdmin
      .from('billing_customers')
      .update({
        stripe_subscription_id: subscription.id,
        subscription_status: status,
        last_synced_at: new Date().toISOString(),
      })
      .eq('user_email', userEmail);

    logger.dev('[Billing Sync] Synced user subscription:', {
      userEmail,
      tier,
      status,
      subscriptionId: subscription.id,
    });

    return true;
  } catch (error) {
    logger.error('[Billing Sync] Failed to sync user subscription:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return false;
  }
}
