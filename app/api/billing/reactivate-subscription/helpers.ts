import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

export async function getSubscriptionIdFromDb(
  email: string,
  supabase: SupabaseClient,
): Promise<string | null> {
  const { data: userData, error } = await supabase
    .from('users')
    .select('stripe_subscription_id')
    .eq('email', email)
    .single();

  if (error || !userData?.stripe_subscription_id) {
    if (error && error.code !== 'PGRST116') {
      logger.error('[Billing API] Error fetching user subscription:', error);
    }
    return null;
  }

  return userData.stripe_subscription_id;
}

export async function reactivateStripeSubscription(
  subscriptionId: string,
  stripe: Stripe,
): Promise<Stripe.Subscription> {
  let subscription: Stripe.Subscription;

  try {
    subscription = await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error: unknown) {
    const stripeError = error as { code?: string };
    if (stripeError?.code === 'resource_missing') {
      throw ApiErrorHandler.createError(
        'Subscription missing in Stripe',
        'SUBSCRIPTION_NOT_FOUND',
        404,
      );
    }
    throw error;
  }

  if (subscription.status === 'canceled' && !subscription.cancel_at_period_end) {
    throw ApiErrorHandler.createError(
      'Cannot reactivate permanently cancelled sub',
      'BAD_REQUEST',
      400,
    );
  }

  if (subscription.cancel_at_period_end) {
    subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
  }

  if (subscription.status !== 'active') {
    throw ApiErrorHandler.createError(
      `Cannot reactivate sub in ${subscription.status} state`,
      'BAD_REQUEST',
      400,
    );
  }

  return subscription;
}

export async function updateUserSubscriptionInDb(
  email: string,
  subscription: Stripe.Subscription,
  supabase: SupabaseClient,
): Promise<void> {
  const activeSub = subscription as unknown as Stripe.Subscription & {
    current_period_end: number;
    current_period_start: number;
  };

  const expiresAt = activeSub.current_period_end
    ? new Date(activeSub.current_period_end * 1000)
    : null;
  const currentPeriodStart = activeSub.current_period_start
    ? new Date(activeSub.current_period_start * 1000)
    : null;

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      subscription_cancel_at_period_end: false,
      subscription_expires: expiresAt?.toISOString() || null,
      subscription_current_period_start: currentPeriodStart?.toISOString() || null,
    })
    .eq('email', email);

  if (error) {
    logger.error('[Billing API] DB update error:', error);
    throw new Error('Failed to update user subscription in database');
  }
}
