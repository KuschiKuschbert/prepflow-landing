import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { OrphanedSubscriptionCheckResult } from '../types';

/**
 * Checks for Stripe subscriptions that don't have a linked user in the database.
 */
export async function checkOrphanedSubscriptions(
  subscriptions: Stripe.Subscription[],
  supabaseAdmin: SupabaseClient
): Promise<OrphanedSubscriptionCheckResult> {
  const result: OrphanedSubscriptionCheckResult = {
    subscriptionsWithMissingUsers: [],
    healthy: true,
  };

  for (const subscription of subscriptions) {
    const customerId = subscription.customer as string;

    const { data: billingData, error: billingDataError } = await supabaseAdmin
      .from('billing_customers')
      .select('user_email')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();

    if (billingDataError && billingDataError.code !== 'PGRST116') {
      logger.warn('[Billing Health] Error fetching billing customer:', {
        error: billingDataError.message,
        code: billingDataError.code,
        customerId,
      });
    }

    if (!billingData) {
      result.subscriptionsWithMissingUsers.push(subscription.id);
      result.healthy = false;
    }
  }

  return result;
}
