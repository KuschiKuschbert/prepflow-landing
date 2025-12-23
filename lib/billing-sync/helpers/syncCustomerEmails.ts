import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

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
