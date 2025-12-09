import { getStripe } from './stripe';
import { supabaseAdmin } from './supabase';
import { logger } from './logger';

/**
 * Get or create Stripe customer ID for a user email
 * Stripe best practice: Use email as primary identifier, cache customer ID in database
 *
 * @param userEmail - User email address
 * @returns Stripe customer ID or null if Stripe is not configured
 */
export async function getOrCreateCustomerId(userEmail: string): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) {
    logger.warn('[Billing] Stripe not configured, cannot get/create customer');
    return null;
  }

  if (!userEmail) {
    logger.warn('[Billing] No email provided, cannot get/create customer');
    return null;
  }

  // Stripe best practice: Check database cache first (reduces API calls)
  if (supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from('billing_customers')
      .select('stripe_customer_id')
      .eq('user_email', userEmail)
      .maybeSingle();

    if (data?.stripe_customer_id) {
      const customerId = data.stripe_customer_id as string;

      // Stripe best practice: Verify customer still exists (handle deleted customers)
      try {
        const customer = await stripe.customers.retrieve(customerId);
        if (customer && !customer.deleted) {
          return customerId;
        }
        // Customer was deleted, remove from cache and create new one
        logger.dev('[Billing] Cached customer was deleted, creating new customer:', {
          email: userEmail,
          deletedCustomerId: customerId,
        });
        await supabaseAdmin.from('billing_customers').delete().eq('stripe_customer_id', customerId);
      } catch (error) {
        // Customer doesn't exist, remove from cache and create new one
        logger.dev('[Billing] Cached customer not found, creating new customer:', {
          email: userEmail,
          invalidCustomerId: customerId,
        });
        await supabaseAdmin.from('billing_customers').delete().eq('stripe_customer_id', customerId);
      }
    }
  }

  // Stripe best practice: Search by email (handles case where DB cache is missing)
  try {
    const search = await stripe.customers.list({ email: userEmail, limit: 1 });
    const existing = search.data[0];

    if (existing?.id && !existing.deleted) {
      await upsertCustomerMapping(userEmail, existing.id);
      return existing.id;
    }
  } catch (error) {
    logger.error('[Billing] Failed to search for customer by email:', {
      error: error instanceof Error ? error.message : String(error),
      email: userEmail,
    });
  }

  // Stripe best practice: Create new customer if not found
  try {
    const created = await stripe.customers.create({ email: userEmail });
    await upsertCustomerMapping(userEmail, created.id);
    logger.dev('[Billing] Created new Stripe customer:', {
      email: userEmail,
      customerId: created.id,
    });
    return created.id;
  } catch (error) {
    logger.error('[Billing] Failed to create Stripe customer:', {
      error: error instanceof Error ? error.message : String(error),
      email: userEmail,
    });
    return null;
  }
}

/**
 * Upsert customer mapping in database
 * Stripe best practice: Cache customer ID to reduce API calls
 *
 * @param userEmail - User email address
 * @param customerId - Stripe customer ID
 */
async function upsertCustomerMapping(userEmail: string, customerId: string): Promise<void> {
  if (!supabaseAdmin) return;

  try {
    await supabaseAdmin.from('billing_customers').upsert(
      {
        user_email: userEmail,
        stripe_customer_id: customerId,
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: 'user_email' },
    );
  } catch (error) {
    logger.error('[Billing] Failed to upsert customer mapping:', {
      error: error instanceof Error ? error.message : String(error),
      email: userEmail,
      customerId,
    });
  }
}

export function resolvePriceIdFromTier(tier: string | undefined): string | null {
  switch ((tier || '').toLowerCase()) {
    case 'starter':
      return process.env.STRIPE_PRICE_STARTER_MONTHLY || null;
    case 'pro':
      return process.env.STRIPE_PRICE_PRO_MONTHLY || null;
    case 'business':
      return process.env.STRIPE_PRICE_BUSINESS_MONTHLY || null;
    default:
      return null;
  }
}
