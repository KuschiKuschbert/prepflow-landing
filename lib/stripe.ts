import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (stripeClient) return stripeClient;
  stripeClient = new Stripe(key, { apiVersion: '2025-10-29.clover' });
  return stripeClient;
}
