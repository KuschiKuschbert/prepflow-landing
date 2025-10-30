import { getStripe } from './stripe';
import { supabaseAdmin } from './supabase';

export async function getOrCreateCustomerId(userEmail: string): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) return null;
  // Try DB mapping
  if (supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from('billing_customers')
      .select('stripe_customer_id')
      .eq('user_email', userEmail)
      .maybeSingle();
    if (data?.stripe_customer_id) return data.stripe_customer_id as string;
  }
  // Fallback: search by email
  const search = await stripe.customers.list({ email: userEmail, limit: 1 });
  const existing = search.data[0];
  if (existing?.id) {
    await upsertCustomerMapping(userEmail, existing.id);
    return existing.id;
  }
  // Create
  const created = await stripe.customers.create({ email: userEmail });
  await upsertCustomerMapping(userEmail, created.id);
  return created.id;
}

async function upsertCustomerMapping(userEmail: string, customerId: string): Promise<void> {
  if (!supabaseAdmin) return;
  await supabaseAdmin
    .from('billing_customers')
    .upsert(
      { user_email: userEmail, stripe_customer_id: customerId },
      { onConflict: 'user_email' },
    );
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
