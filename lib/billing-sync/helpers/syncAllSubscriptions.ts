import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { processSingleSubscription } from './processSingleSubscription';

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
        const result = await processSingleSubscription(subscription, stripe);
        if (result.success) {
          synced++;
        } else {
          errors++;
        }
        report.push(result.message);
      } catch (error) {
        errors++;
        report.push(
          `Error syncing subscription ${subscription.id}: ${error instanceof Error ? error.message : String(error)}`,
        );
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
