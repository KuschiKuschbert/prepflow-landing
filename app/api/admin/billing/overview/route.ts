import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/billing/overview
 * Get billing overview and subscription statistics
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Get subscription counts from database
    const { count: activeSubscriptions, error: activeSubscriptionsError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active');

    if (activeSubscriptionsError) {
      logger.warn('[Admin Billing Overview] Error fetching active subscriptions count:', {
        error: activeSubscriptionsError.message,
        code: (activeSubscriptionsError as PostgrestError).code,
      });
    }

    const { count: trialSubscriptions, error: trialSubscriptionsError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'trial');

    if (trialSubscriptionsError) {
      logger.warn('[Admin Billing Overview] Error fetching trial subscriptions count:', {
        error: trialSubscriptionsError.message,
        code: (trialSubscriptionsError as PostgrestError).code,
      });
    }

    const { count: cancelledSubscriptions, error: cancelledSubscriptionsError } =
      await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_status', 'cancelled');

    if (cancelledSubscriptionsError) {
      logger.warn('[Admin Billing Overview] Error fetching cancelled subscriptions count:', {
        error: cancelledSubscriptionsError.message,
        code: (cancelledSubscriptionsError as PostgrestError).code,
      });
    }

    // Try to get Stripe data if configured
    let monthlyRecurringRevenue = 0;
    let totalRevenue = 0;
    let failedPayments = 0;
    const subscriptions: unknown[] = [];

    const stripe = getStripe();
    if (stripe) {
      try {
        // Get active subscriptions from Stripe
        const stripeSubscriptions = await stripe.subscriptions.list({
          limit: 100,
          status: 'all',
        });

        for (const sub of stripeSubscriptions.data) {
          const amount = sub.items.data[0]?.price?.unit_amount || 0;
          monthlyRecurringRevenue += amount;
          // Calculate revenue based on subscription period
          // Stripe Subscription type has current_period_start and current_period_end as numbers (Unix timestamps)
          const periodStart = (sub as unknown as { current_period_start: number })
            .current_period_start;
          const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end;
          if (
            periodStart &&
            periodEnd &&
            typeof periodStart === 'number' &&
            typeof periodEnd === 'number'
          ) {
            totalRevenue += (amount * (periodEnd - periodStart)) / (30 * 24 * 60 * 60);
          }

          subscriptions.push({
            id: sub.id,
            customer_email: sub.customer as string, // Would need to fetch customer details
            status: sub.status,
            amount,
            created_at: new Date(sub.created * 1000).toISOString(),
          });

          if (sub.status === 'past_due' || sub.status === 'unpaid') {
            failedPayments++;
          }
        }
      } catch (stripeError) {
        logger.warn('[Admin Billing] Stripe error (may not be configured):', stripeError);
      }
    }

    return NextResponse.json({
      success: true,
      totalRevenue: Math.round(totalRevenue),
      monthlyRecurringRevenue: Math.round(monthlyRecurringRevenue),
      activeSubscriptions: activeSubscriptions || 0,
      trialSubscriptions: trialSubscriptions || 0,
      cancelledSubscriptions: cancelledSubscriptions || 0,
      failedPayments,
      subscriptions,
      note: stripe ? 'Stripe data included' : 'Stripe not configured - showing database data only',
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Admin Billing API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/billing/overview', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
