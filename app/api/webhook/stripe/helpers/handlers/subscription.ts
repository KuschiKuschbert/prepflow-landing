import { clearTierCache } from '@/lib/feature-gate';
import { logger } from '@/lib/logger';
import { extractTierFromStripe } from '@/lib/webhook-helpers';
import { subscriptionNotifications } from '@/lib/subscription-notifications';
import type Stripe from 'stripe';
import { getUserEmailFromCustomerId } from '../getUserEmail';
import { updateUserSubscription } from '../updateSubscription';

/**
 * Handle customer.subscription.created event
 */
export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  stripe: Stripe,
): Promise<void> {
  const sub = subscription;
  const customerId = sub.customer as string;

  // Stripe best practice: Handle deleted customers gracefully
  if (typeof customerId === 'string' && customerId.startsWith('deleted_')) {
    logger.warn('[Stripe Webhook] Subscription created for deleted customer:', {
      subscriptionId: sub.id,
      customerId,
    });
    return;
  }

  const userEmail = await getUserEmailFromCustomerId(customerId, stripe);

  if (!userEmail) {
    logger.warn('[Stripe Webhook] Could not find user email for customer:', customerId);
    return;
  }

  const tier =
    extractTierFromStripe(sub.items?.data?.[0]?.price?.id, sub.metadata || undefined) || 'starter';

  const expiresAt = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;

  const currentPeriodStart = sub.current_period_start
    ? new Date(sub.current_period_start * 1000)
    : null;

  await updateUserSubscription(
    userEmail,
    tier,
    'active',
    expiresAt,
    sub.id,
    sub.cancel_at_period_end || false,
    currentPeriodStart || undefined,
  );
  clearTierCache(userEmail);

  // Send notification
  await subscriptionNotifications.subscriptionActivated(userEmail, tier);

  logger.dev('[Stripe Webhook] Subscription created:', {
    userEmail,
    tier,
    subscriptionId: sub.id,
  });
}

/**
 * Handle customer.subscription.updated event
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  stripe: Stripe,
): Promise<void> {
  const sub = subscription;
  const customerId = sub.customer as string;

  // Stripe best practice: Handle deleted customers gracefully
  if (typeof customerId === 'string' && customerId.startsWith('deleted_')) {
    logger.warn('[Stripe Webhook] Subscription updated for deleted customer:', {
      subscriptionId: sub.id,
      customerId,
    });
    return;
  }

  const userEmail = await getUserEmailFromCustomerId(customerId, stripe);

  if (!userEmail) {
    logger.warn('[Stripe Webhook] Could not find user email for customer:', customerId);
    return;
  }

  const tier =
    extractTierFromStripe(sub.items?.data?.[0]?.price?.id, sub.metadata || undefined) || 'starter';

  const expiresAt = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;

  const currentPeriodStart = sub.current_period_start
    ? new Date(sub.current_period_start * 1000)
    : null;

  // Map all Stripe subscription statuses correctly
  let status = 'active';
  if (sub.status === 'past_due') status = 'past_due';
  else if (sub.status === 'canceled' || sub.status === 'unpaid') status = 'cancelled';
  else if (sub.status === 'trialing') status = 'trial';
  else if (sub.status === 'incomplete') status = 'trial';
  else if (sub.status === 'incomplete_expired') status = 'cancelled';

  await updateUserSubscription(
    userEmail,
    tier,
    status,
    expiresAt,
    sub.id,
    sub.cancel_at_period_end || false,
    currentPeriodStart || undefined,
  );
  clearTierCache(userEmail);

  // Send notifications for status changes
  if (sub.cancel_at_period_end) {
    await subscriptionNotifications.subscriptionCancelled(userEmail, true, expiresAt || undefined);
  } else if (status === 'cancelled') {
    await subscriptionNotifications.subscriptionCancelled(userEmail, false);
  }

  logger.dev('[Stripe Webhook] Subscription updated:', {
    userEmail,
    tier,
    status,
    subscriptionId: sub.id,
    cancelAtPeriodEnd: sub.cancel_at_period_end,
  });
}

/**
 * Handle customer.subscription.deleted event
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  stripe: Stripe,
): Promise<void> {
  const sub = subscription;
  const customerId = sub.customer as string;

  // Stripe best practice: Handle deleted customers gracefully
  if (typeof customerId === 'string' && customerId.startsWith('deleted_')) {
    logger.warn('[Stripe Webhook] Subscription deleted for deleted customer:', {
      subscriptionId: sub.id,
      customerId,
    });
    return;
  }

  const userEmail = await getUserEmailFromCustomerId(customerId, stripe);

  if (!userEmail) {
    logger.warn('[Stripe Webhook] Could not find user email for customer:', customerId);
    return;
  }

  // Set to cancelled and downgrade to starter
  await updateUserSubscription(userEmail, 'starter', 'cancelled', null, sub.id, false, undefined);
  clearTierCache(userEmail);

  // Send notification
  await subscriptionNotifications.subscriptionCancelled(userEmail, false);

  logger.dev('[Stripe Webhook] Subscription deleted:', {
    userEmail,
    subscriptionId: sub.id,
  });
}
