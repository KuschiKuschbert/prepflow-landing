import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';

export async function fetchStripeData() {
  const stripe = getStripe();
  if (!stripe) {
    return {
      monthlyRecurringRevenue: 0,
      totalRevenue: 0,
      failedPayments: 0,
      subscriptions: [],
      hasStripe: false,
    };
  }

  try {
    const stripeSubscriptions = await stripe.subscriptions.list({
      limit: 100,
      status: 'all',
    });

    let monthlyRecurringRevenue = 0;
    let totalRevenue = 0;
    let failedPayments = 0;
    const subscriptions: unknown[] = [];

    for (const sub of stripeSubscriptions.data) {
      const amount = sub.items.data[0]?.price?.unit_amount || 0;
      monthlyRecurringRevenue += amount;

      const periodStart = (sub as unknown as { current_period_start: number }).current_period_start;
      const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end;
      if (typeof periodStart === 'number' && typeof periodEnd === 'number') {
        totalRevenue += (amount * (periodEnd - periodStart)) / (30 * 24 * 60 * 60);
      }

      subscriptions.push({
        id: sub.id,
        customer_email: sub.customer as string,
        status: sub.status,
        amount,
        created_at: new Date(sub.created * 1000).toISOString(),
      });

      if (sub.status === 'past_due' || sub.status === 'unpaid') {
        failedPayments++;
      }
    }

    return {
      monthlyRecurringRevenue,
      totalRevenue,
      failedPayments,
      subscriptions,
      hasStripe: true,
    };
  } catch (stripeError) {
    logger.warn('[Admin Billing] Stripe error (may not be configured):', stripeError);
    return {
      monthlyRecurringRevenue: 0,
      totalRevenue: 0,
      failedPayments: 0,
      subscriptions: [],
      hasStripe: true, // Stripe is configured but failed
    };
  }
}
