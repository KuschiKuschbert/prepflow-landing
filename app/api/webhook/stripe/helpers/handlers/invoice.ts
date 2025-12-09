import { clearTierCache } from '@/lib/feature-gate';
import { logger } from '@/lib/logger';
import { extractTierFromStripe } from '@/lib/webhook-helpers';
import { subscriptionNotifications } from '@/lib/subscription-notifications';
import type { TierSlug } from '@/lib/tier-config';
import type Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { getUserEmailFromInvoice } from '../getUserEmail';
import { updateUserSubscription } from '../updateSubscription';

/**
 * Handle invoice.payment_succeeded event
 */
export async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  stripe: Stripe,
): Promise<void> {
  const userEmail = await getUserEmailFromInvoice(invoice, stripe);

  if (!userEmail) {
    logger.warn('[Stripe Webhook] Could not find user email for invoice:', {
      invoiceId: invoice.id,
      customerId: invoice.customer,
    });
    return;
  }

  // Ensure subscription remains active
  const subscriptionId = (invoice as any).subscription;
  if (subscriptionId) {
    const subscriptionIdStr =
      typeof subscriptionId === 'string' ? subscriptionId : subscriptionId.id;
    const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionIdStr);
    const subscription = subscriptionResponse as unknown as Stripe.Subscription & {
      current_period_end?: number;
      current_period_start?: number;
    };
    const tier =
      extractTierFromStripe(
        subscription.items?.data?.[0]?.price?.id,
        subscription.metadata || undefined,
      ) || 'starter';

    const expiresAt = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000)
      : null;

    const currentPeriodStart = subscription.current_period_start
      ? new Date(subscription.current_period_start * 1000)
      : null;

    await updateUserSubscription(
      userEmail,
      tier,
      'active',
      expiresAt,
      subscription.id,
      subscription.cancel_at_period_end || false,
      currentPeriodStart || undefined,
    );
    clearTierCache(userEmail);

    // Send notification
    const amount = invoice.amount_paid ? invoice.amount_paid / 100 : undefined; // Convert from cents
    await subscriptionNotifications.paymentSucceeded(userEmail, amount);

    logger.dev('[Stripe Webhook] Payment succeeded:', {
      userEmail,
      tier,
      subscriptionId: subscription.id,
    });
  }
}

/**
 * Handle invoice.payment_failed event
 */
export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  stripe: Stripe,
): Promise<void> {
  const userEmail = await getUserEmailFromInvoice(invoice, stripe);

  if (!userEmail) {
    logger.warn('[Stripe Webhook] Could not find user email for invoice:', {
      invoiceId: invoice.id,
      customerId: invoice.customer,
    });
    return;
  }

  // Set status to past_due but keep tier
  if (!supabaseAdmin) {
    logger.warn('[Stripe Webhook] Supabase not available, cannot update subscription status');
    return;
  }

  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('subscription_tier, stripe_subscription_id')
    .eq('email', userEmail)
    .single();

  const tier = (userData?.subscription_tier as TierSlug) || 'starter';
  const subscriptionId = userData?.stripe_subscription_id || undefined;

  await updateUserSubscription(
    userEmail,
    tier,
    'past_due',
    null,
    subscriptionId,
    undefined,
    undefined,
  );
  clearTierCache(userEmail);

  // Send notification
  await subscriptionNotifications.paymentFailed(userEmail);

  logger.dev('[Stripe Webhook] Payment failed:', {
    userEmail,
    invoiceId: invoice.id,
  });
}
