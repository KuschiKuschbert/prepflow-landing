import { getStripe } from '@/lib/stripe';
import { logger } from '@/lib/logger';
import { upsertCustomerMapping } from './upsertCustomerMapping';

/**
 * Search for existing Stripe customer by email.
 *
 * @param {string} userEmail - User email address
 * @returns {Promise<string | null>} Customer ID if found, null otherwise
 */
export async function searchCustomerByEmail(userEmail: string): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) {
    return null;
  }

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

  return null;
}
