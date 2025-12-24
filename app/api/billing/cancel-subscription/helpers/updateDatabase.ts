import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

interface UpdateDatabaseParams {
  userEmail: string;
  immediate: boolean;
  cancelAtPeriodEnd: boolean;
  expiresAt: Date | null;
}

/**
 * Update subscription status in database
 *
 * @param {UpdateDatabaseParams} params - Update parameters
 */
export async function updateSubscriptionInDatabase(params: UpdateDatabaseParams): Promise<void> {
  const { userEmail, immediate, cancelAtPeriodEnd, expiresAt } = params;

  const updateData: any = {
    subscription_cancel_at_period_end: cancelAtPeriodEnd,
    updated_at: new Date().toISOString(),
  };

  if (immediate) {
    updateData.subscription_status = 'cancelled';
    updateData.subscription_expires = null;
    updateData.subscription_tier = 'starter'; // Downgrade to starter
  } else {
    // Keep status active but mark as scheduled for cancellation
    updateData.subscription_expires = expiresAt?.toISOString() || null;
  }

  const { error: updateError } = await supabaseAdmin!
    .from('users')
    .update(updateData)
    .eq('email', userEmail);

  if (updateError) {
    logger.error('[Billing API] Failed to update subscription in database:', {
      error: updateError.message,
      code: (updateError as any).code,
      userEmail,
    });
    // Don't fail the request, subscription was cancelled in Stripe
  }
}
