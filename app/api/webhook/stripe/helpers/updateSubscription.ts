import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { TierSlug } from '@/lib/tier-config';

/**
 * Update user subscription tier and status in database
 */
export async function updateUserSubscription(
  userEmail: string,
  tier: TierSlug,
  status: string,
  expiresAt: Date | null = null,
  subscriptionId?: string,
  cancelAtPeriodEnd?: boolean,
  currentPeriodStart?: Date,
): Promise<void> {
  if (!supabaseAdmin) {
    logger.warn('[Stripe Webhook] Supabase not available, cannot update subscription');
    return;
  }

  const updateData: any = {
    subscription_tier: tier,
    subscription_status: status,
    subscription_expires: expiresAt?.toISOString() || null,
    updated_at: new Date().toISOString(),
  };

  if (subscriptionId) {
    updateData.stripe_subscription_id = subscriptionId;
  }

  if (cancelAtPeriodEnd !== undefined) {
    updateData.subscription_cancel_at_period_end = cancelAtPeriodEnd;
  }

  if (currentPeriodStart) {
    updateData.subscription_current_period_start = currentPeriodStart.toISOString();
  }

  const { error } = await supabaseAdmin.from('users').update(updateData).eq('email', userEmail);

  if (error) {
    logger.error('[Stripe Webhook] Failed to update user subscription:', {
      error: error.message,
      userEmail,
      tier,
      status,
    });
    throw error;
  }

  // Also update billing_customers table if subscription ID is provided
  if (subscriptionId && supabaseAdmin) {
    await supabaseAdmin
      .from('billing_customers')
      .update({
        stripe_subscription_id: subscriptionId,
        subscription_status: status,
        last_synced_at: new Date().toISOString(),
      })
      .eq('user_email', userEmail);
  }

  logger.dev('[Stripe Webhook] Updated user subscription:', {
    userEmail,
    tier,
    status,
    expiresAt: expiresAt?.toISOString(),
    subscriptionId,
    cancelAtPeriodEnd,
  });
}
