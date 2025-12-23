import type Stripe from 'stripe';

interface CancelSubscriptionParams {
  stripe: Stripe;
  subscriptionId: string;
  subscription: Stripe.Subscription;
  immediate: boolean;
}

interface CancelResult {
  updatedSubscription: Stripe.Subscription;
  cancelAtPeriodEnd: boolean;
  expiresAt: Date | null;
}

/**
 * Cancel Stripe subscription (immediate or at period end)
 *
 * @param {CancelSubscriptionParams} params - Cancellation parameters
 * @returns {Promise<CancelResult>} Cancellation result
 */
export async function cancelStripeSubscription(
  params: CancelSubscriptionParams,
): Promise<CancelResult> {
  const { stripe, subscriptionId, subscription, immediate } = params;

  let updatedSubscription: Stripe.Subscription;
  let cancelAtPeriodEnd = false;
  let expiresAt: Date | null = null;

  if (immediate) {
    // Cancel immediately
    updatedSubscription = await stripe.subscriptions.cancel(subscriptionId);
    expiresAt = null; // Access ends immediately
  } else {
    // Cancel at period end (scheduled cancellation)
    updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    cancelAtPeriodEnd = true;
    expiresAt = (subscription as any).current_period_end
      ? new Date((subscription as any).current_period_end * 1000)
      : null;
  }

  return { updatedSubscription, cancelAtPeriodEnd, expiresAt };
}

