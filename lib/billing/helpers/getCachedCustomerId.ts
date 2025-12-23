import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { verifyCachedCustomer } from './verifyCachedCustomer';

/**
 * Get cached customer ID from database and verify it exists in Stripe.
 *
 * @param {string} userEmail - User email address
 * @returns {Promise<string | null>} Customer ID if found and valid, null otherwise
 */
export async function getCachedCustomerId(userEmail: string): Promise<string | null> {
  if (!supabaseAdmin) {
    return null;
  }

  const { data, error: fetchError } = await supabaseAdmin
    .from('billing_customers')
    .select('stripe_customer_id')
    .eq('user_email', userEmail)
    .maybeSingle();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 is "not found" - that's okay, we'll create the customer
    logger.warn('[Billing] Error fetching customer from cache:', {
      error: fetchError.message,
      userEmail,
    });
    return null;
  }

  if (data?.stripe_customer_id) {
    const customerId = data.stripe_customer_id as string;
    return await verifyCachedCustomer(customerId, userEmail);
  }

  return null;
}
