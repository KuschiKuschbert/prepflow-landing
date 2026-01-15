import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { syncUserSubscription } from './syncUserSubscription';

/**
 * Sync all subscriptions from Stripe.
 * Useful for recovery after webhook failures.
 *
 * @param {number} limit - Maximum number of subscriptions to sync (default: 100)
 * @returns {Promise<{ synced: number; errors: number; report: string[] }>} Sync results
 */
export async function syncAllSubscriptions(limit: number = 100): Promise<{
  synced: number;
  errors: number;
  report: string[];
}> {
  const stripe = getStripe();
  if (!stripe) {
    logger.warn('[Billing Sync] Stripe not configured');
    return { synced: 0, errors: 0, report: ['Stripe not configured'] };
  }

  if (!supabaseAdmin) {
    logger.warn('[Billing Sync] Supabase not available');
    return { synced: 0, errors: 0, report: ['Supabase not available'] };
  }

  let synced = 0;
  let errors = 0;
  const report: string[] = [];

  try {
    // Get all active subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      status: 'all',
      limit,
    });

    for (const subscription of subscriptions.data) {
      try {
        const customerId = subscription.customer as string;

        // Get user email from billing_customers table
        const { data: billingData } = await supabaseAdmin
          .from('billing_customers')
          .select('user_email')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();

        if (!billingData?.user_email) {
          // Try to get email from Stripe customer
          const customer = await stripe.customers.retrieve(customerId);
          const email = 'deleted' in customer ? null : customer.email;

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

            // Sync subscription
            const success = await syncUserSubscription(email);
            if (success) {
              synced++;
              report.push(`Synced subscription for ${email}`);
            } else {
              errors++;
              report.push(`Failed to sync subscription for ${email}`);
            }
          } else {
            errors++;
            report.push(`No email found for customer ${customerId}`);
          }
        } else {
          // Sync subscription
          const success = await syncUserSubscription(billingData.user_email);
          if (success) {
            synced++;
            report.push(`Synced subscription for ${billingData.user_email}`);
          } else {
            errors++;
            report.push(`Failed to sync subscription for ${billingData.user_email}`);
          }
        }
      } catch (error) {
        errors++;
        report.push(
          `Error syncing subscription ${subscription.id}: ${error instanceof Error ? error.message : String(error)}`,
        );
        logger.error('[Billing Sync] Error syncing subscription:', {
          error: error instanceof Error ? error.message : String(error),
          subscriptionId: subscription.id,
        });
      }
    }

    logger.info('[Billing Sync] Subscription sync completed:', { synced, errors });
    return { synced, errors, report };
  } catch (error) {
    logger.error('[Billing Sync] Failed to sync subscriptions:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      synced,
      errors: errors + 1,
      report: [...report, `Sync failed: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}
