import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type Stripe from 'stripe';
import { syncUserSubscription } from './syncUserSubscription';

interface SyncResult {
  success: boolean;
  message: string;
}

export async function processSingleSubscription(
  subscription: Stripe.Subscription,
  stripe: Stripe,
): Promise<SyncResult> {
  if (!supabaseAdmin) {
    throw new Error('Supabase Admin not available');
  }

  try {
    const customerId = subscription.customer as string;

    // Get user email from billing_customers table
    const { data: billingData } = await supabaseAdmin
      .from('billing_customers')
      .select('user_email')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();

    let email = billingData?.user_email;

    if (!email) {
      // Try to get email from Stripe customer
      const customer = await stripe.customers.retrieve(customerId);
      email = 'deleted' in customer ? null : customer.email;

      if (email) {
        // Create billing_customers entry
        await supabaseAdmin.from('billing_customers').upsert(
          {
            user_email: email,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
            last_synced_at: new Date().toISOString(),
          },
          { onConflict: 'stripe_customer_id' },
        );
      } else {
        return { success: false, message: `No email found for customer ${customerId}` };
      }
    }

    if (email) {
      const success = await syncUserSubscription(email);
      if (success) {
        return { success: true, message: `Synced subscription for ${email}` };
      } else {
        return { success: false, message: `Failed to sync subscription for ${email}` };
      }
    }

    return { success: false, message: `No email determined` };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error('[Billing Sync] Error processing subscription:', {
      error: msg,
      subscriptionId: subscription.id,
    });
    throw error; // Re-throw to be caught by the caller if needed, or return failure
  }
}
