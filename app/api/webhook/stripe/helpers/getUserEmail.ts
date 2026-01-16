import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type Stripe from 'stripe';

/**
 * Get user email from Stripe customer ID with multiple fallbacks
 * Fallback order:
 * 1. Database lookup (billing_customers table)
 * 2. Stripe customer retrieve (fetch email from Stripe API)
 * 3. Auto-populate billing_customers table when found via fallback
 */
export async function getUserEmailFromCustomerId(
  customerId: string,
  stripe?: Stripe,
): Promise<string | null> {
  if (!supabaseAdmin) return null;

  // Handle both customer ID string and customer object
  const id = typeof customerId === 'string' ? customerId : (customerId as { id: string })?.id || null;
  if (!id) return null;

  // Fallback 1: Try database lookup first
  const { data: dbData } = await supabaseAdmin
    .from('billing_customers')
    .select('user_email')
    .eq('stripe_customer_id', id)
    .maybeSingle();

  if (dbData?.user_email) {
    return dbData.user_email;
  }

  // Fallback 2: Retrieve customer from Stripe API
  if (stripe) {
    try {
      const customer = await stripe.customers.retrieve(id);
      if (customer && !customer.deleted && typeof customer === 'object') {
        const email = (customer as Stripe.Customer).email;
        if (email) {
          // Auto-populate billing_customers table for future lookups
          await supabaseAdmin
            .from('billing_customers')
            .upsert(
              { user_email: email, stripe_customer_id: id },
              { onConflict: 'stripe_customer_id' },
            );
          logger.dev('[Stripe Webhook] Found email via Stripe API and cached:', {
            email,
            customerId: id,
          });
          return email;
        }
      }
    } catch (error) {
      logger.warn('[Stripe Webhook] Failed to retrieve customer from Stripe:', {
        error: error instanceof Error ? error.message : String(error),
        customerId: id,
      });
    }
  }

  return null;
}

/**
 * Get user email from checkout session metadata or customer lookup
 */
export async function getUserEmailFromCheckoutSession(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
): Promise<string | null> {
  // Try metadata first (set during checkout creation)
  if (session.metadata?.user_email) {
    const email = session.metadata.user_email;
    // Cache the mapping if customer ID is available
    if (session.customer && supabaseAdmin) {
      await supabaseAdmin
        .from('billing_customers')
        .upsert(
          { user_email: email, stripe_customer_id: session.customer as string },
          { onConflict: 'stripe_customer_id' },
        );
    }
    return email;
  }

  // Fallback to customer lookup
  if (session.customer) {
    return getUserEmailFromCustomerId(session.customer as string, stripe);
  }

  return null;
}

/**
 * Get user email from invoice (for invoice events)
 */
export async function getUserEmailFromInvoice(
  invoice: Stripe.Invoice,
  stripe: Stripe,
): Promise<string | null> {
  // Try invoice customer_email first
  if (invoice.customer_email) {
    const email = invoice.customer_email;
    // Cache the mapping if customer ID is available
    if (invoice.customer && supabaseAdmin) {
      await supabaseAdmin
        .from('billing_customers')
        .upsert(
          { user_email: email, stripe_customer_id: invoice.customer as string },
          { onConflict: 'stripe_customer_id' },
        );
    }
    return email;
  }

  // Fallback to customer lookup
  if (invoice.customer) {
    return getUserEmailFromCustomerId(invoice.customer as string, stripe);
  }

  return null;
}
