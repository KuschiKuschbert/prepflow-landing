import { logger } from '@/lib/logger';
import Stripe from 'stripe';
import { UserSubscriptionCheckResult } from '../types';

interface UserWithSubscription {
  email: string;
  subscription_status: string | null;
  stripe_subscription_id: string | null;
}

/**
 * Checks users' database subscription status against Stripe.
 */
export async function checkUserSubscriptions(
  users: UserWithSubscription[],
  stripe: Stripe,
): Promise<UserSubscriptionCheckResult> {
  const result: UserSubscriptionCheckResult = {
    mismatchedStatuses: [],
    usersWithMissingSubscriptions: [],
    healthy: true,
  };

  for (const user of users) {
    if (!user.stripe_subscription_id) continue;

    try {
      const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);

      // Check status mismatch
      const dbStatus = user.subscription_status || 'trial';
      const stripeStatusRaw = subscription.status;

      // Normalize statuses for comparison
      let normalizedStripeStatus: string = stripeStatusRaw;
      if (stripeStatusRaw === 'canceled') normalizedStripeStatus = 'cancelled';
      else if (stripeStatusRaw === 'trialing') normalizedStripeStatus = 'trial';
      else if (stripeStatusRaw === 'incomplete') normalizedStripeStatus = 'trial';
      else if (stripeStatusRaw === 'incomplete_expired') normalizedStripeStatus = 'cancelled';

      if (dbStatus !== normalizedStripeStatus) {
        result.mismatchedStatuses.push({
          email: user.email,
          dbStatus,
          stripeStatus: normalizedStripeStatus,
        });
        result.healthy = false;
      }
    } catch (error) {
      // Narrow error type safely
      const code =
        error && typeof error === 'object' && 'code' in error
          ? (error as { code: string }).code
          : undefined;
      const message = error instanceof Error ? error.message : 'Unknown error';

      if (code === 'resource_missing') {
        // Subscription not found in Stripe - log as warning, not error
        logger.warn('[Billing Health] Subscription not found in Stripe:', {
          email: user.email,
          subscriptionId: user.stripe_subscription_id,
        });
        result.usersWithMissingSubscriptions.push(user.email);
        result.healthy = false;
      } else {
        logger.error('[Billing Health] Error checking subscription:', {
          error: message,
          email: user.email,
          subscriptionId: user.stripe_subscription_id,
        });
      }
    }
  }

  return result;
}
