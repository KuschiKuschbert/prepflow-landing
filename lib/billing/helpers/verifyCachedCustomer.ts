import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Verify if a cached customer ID still exists in Stripe.
 * If deleted, removes from cache.
 *
 * @param {string} customerId - Stripe customer ID
 * @param {string} userEmail - User email address
 * @returns {Promise<string | null>} Customer ID if valid, null if deleted/invalid
 */
export async function verifyCachedCustomer(
  customerId: string,
  userEmail: string,
): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) {
    return null;
  }

  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer && !customer.deleted) {
      return customerId;
    }
    // Customer was deleted, remove from cache
    logger.dev('[Billing] Cached customer was deleted, creating new customer:', {
      email: userEmail,
      deletedCustomerId: customerId,
    });
    await removeCachedCustomer(customerId);
    return null;
  } catch (error) {
    // Customer doesn't exist, remove from cache
    logger.dev('[Billing] Cached customer not found, creating new customer:', {
      email: userEmail,
      invalidCustomerId: customerId,
    });
    await removeCachedCustomer(customerId);
    return null;
  }
}

/**
 * Remove cached customer from database.
 *
 * @param {string} customerId - Stripe customer ID
 */
async function removeCachedCustomer(customerId: string): Promise<void> {
  if (!supabaseAdmin) return;

  const { error } = await supabaseAdmin
    .from('billing_customers')
    .delete()
    .eq('stripe_customer_id', customerId);

  if (error) {
    logger.warn('[Billing] Failed to delete cached customer:', {
      error: error.message,
      customerId,
    });
  }
}

