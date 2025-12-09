import { getStripe } from './stripe';
import { supabaseAdmin } from './supabase';
import { logger } from './logger';
import type { TierSlug } from './tier-config';
import { extractTierFromStripe } from './webhook-helpers';
import type Stripe from 'stripe';

/**
 * Sync Stripe customer emails with database.
 * Reconciles mismatches between Stripe and billing_customers table.
 *
 * @param {number} limit - Maximum number of customers to sync (default: 100)
 * @returns {Promise<{ synced: number; errors: number }>} Sync results
 */
export async function syncCustomerEmails(limit: number = 100): Promise<{
  synced: number;
  errors: number;
}> {
  const stripe = getStripe();
  if (!stripe) {
    logger.warn('[Billing Sync] Stripe not configured');
    return { synced: 0, errors: 0 };
  }

  if (!supabaseAdmin) {
    logger.warn('[Billing Sync] Supabase not available');
    return { synced: 0, errors: 0 };
  }

  let synced = 0;
  let errors = 0;

  try {
    // Get all customers from Stripe (paginated)
    const customers = await stripe.customers.list({ limit });

    for (const customer of customers.data) {
      try {
        if (!customer.email) continue;

        // Check if mapping exists
        const { data: existing } = await supabaseAdmin
          .from('billing_customers')
          .select('user_email')
          .eq('stripe_customer_id', customer.id)
          .maybeSingle();

        if (!existing) {
          // Create mapping
          await supabaseAdmin.from('billing_customers').upsert(
            {
              user_email: customer.email,
              stripe_customer_id: customer.id,
            },
            { onConflict: 'stripe_customer_id' },
          );
          synced++;
          logger.dev('[Billing Sync] Created customer mapping:', {
            email: customer.email,
            customerId: customer.id,
          });
        } else if (existing.user_email !== customer.email) {
          // Update mapping if email changed
          await supabaseAdmin
            .from('billing_customers')
            .update({ user_email: customer.email })
            .eq('stripe_customer_id', customer.id);
          synced++;
          logger.dev('[Billing Sync] Updated customer mapping:', {
            oldEmail: existing.user_email,
            newEmail: customer.email,
            customerId: customer.id,
          });
        }
      } catch (error) {
        errors++;
        logger.error('[Billing Sync] Error syncing customer:', {
          error: error instanceof Error ? error.message : String(error),
          customerId: customer.id,
        });
      }
    }

    logger.info('[Billing Sync] Customer email sync completed:', { synced, errors });
    return { synced, errors };
  } catch (error) {
    logger.error('[Billing Sync] Failed to sync customer emails:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return { synced, errors: errors + 1 };
  }
}

/**
 * Sync subscription data from Stripe to database.
 * Updates user subscription status, tier, and expiry dates.
 *
 * @param {string} userEmail - User email to sync
 * @returns {Promise<boolean>} True if sync successful
 */
export async function syncUserSubscription(userEmail: string): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe || !supabaseAdmin) {
    logger.warn('[Billing Sync] Stripe or Supabase not available');
    return false;
  }

  try {
    // Get user's Stripe customer ID
    const { data: billingData } = await supabaseAdmin
      .from('billing_customers')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('user_email', userEmail)
      .maybeSingle();

    if (!billingData?.stripe_customer_id) {
      logger.warn('[Billing Sync] No Stripe customer found for user:', userEmail);
      return false;
    }

    // Get active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: billingData.stripe_customer_id,
      status: 'all',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      logger.dev('[Billing Sync] No subscriptions found for user:', userEmail);
      return false;
    }

    const subscription = subscriptions.data[0] as unknown as Stripe.Subscription;

    // Extract tier
    const tier =
      extractTierFromStripe(subscription.items.data[0]?.price?.id, subscription.metadata) ||
      ('starter' as TierSlug);

    // Map status
    let status = 'active';
    if (subscription.status === 'past_due') status = 'past_due';
    else if (subscription.status === 'canceled' || subscription.status === 'unpaid')
      status = 'cancelled';
    else if (subscription.status === 'trialing') status = 'trial';
    else if (subscription.status === 'incomplete') status = 'trial';
    else if (subscription.status === 'incomplete_expired') status = 'cancelled';

    const expiresAt = (subscription as any).current_period_end
      ? new Date((subscription as any).current_period_end * 1000)
      : null;

    const currentPeriodStart = (subscription as any).current_period_start
      ? new Date((subscription as any).current_period_start * 1000)
      : null;

    // Update user subscription
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        subscription_tier: tier,
        subscription_status: status,
        subscription_expires: expiresAt?.toISOString() || null,
        subscription_cancel_at_period_end: subscription.cancel_at_period_end || false,
        subscription_current_period_start: currentPeriodStart?.toISOString() || null,
        stripe_subscription_id: subscription.id,
        updated_at: new Date().toISOString(),
      })
      .eq('email', userEmail);

    if (updateError) {
      logger.error('[Billing Sync] Failed to update user subscription:', {
        error: updateError.message,
        userEmail,
      });
      return false;
    }

    // Update billing_customers table
    await supabaseAdmin
      .from('billing_customers')
      .update({
        stripe_subscription_id: subscription.id,
        subscription_status: status,
        last_synced_at: new Date().toISOString(),
      })
      .eq('user_email', userEmail);

    logger.dev('[Billing Sync] Synced user subscription:', {
      userEmail,
      tier,
      status,
      subscriptionId: subscription.id,
    });

    return true;
  } catch (error) {
    logger.error('[Billing Sync] Failed to sync user subscription:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return false;
  }
}

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
          const email = (customer as any).email;

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
