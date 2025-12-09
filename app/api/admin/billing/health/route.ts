import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/billing/health
 * Admin endpoint to check subscription health.
 * Detects mismatches between Stripe and database.
 *
 * @param {NextRequest} req - Request object
 * @returns {Promise<NextResponse>} Health report
 */
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        ApiErrorHandler.createError('Stripe not configured', 'STRIPE_NOT_CONFIGURED', 501),
        { status: 501 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const healthReport: {
      usersWithMissingSubscriptions: string[];
      subscriptionsWithMissingUsers: string[];
      mismatchedStatuses: Array<{ email: string; dbStatus: string; stripeStatus: string }>;
      totalUsers: number;
      totalSubscriptions: number;
      healthy: boolean;
    } = {
      usersWithMissingSubscriptions: [],
      subscriptionsWithMissingUsers: [],
      mismatchedStatuses: [],
      totalUsers: 0,
      totalSubscriptions: 0,
      healthy: true,
    };

    // Get all users with subscriptions
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('email, subscription_status, stripe_subscription_id')
      .not('stripe_subscription_id', 'is', null);

    if (usersError) {
      logger.error('[Billing Health] Failed to fetch users:', { error: usersError.message });
    } else {
      healthReport.totalUsers = users?.length || 0;

      // Check each user's subscription in Stripe
      for (const user of users || []) {
        if (!user.stripe_subscription_id) continue;

        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);

          // Check status mismatch
          let dbStatus = user.subscription_status || 'trial';
          const stripeStatusRaw = subscription.status;

          // Normalize statuses for comparison
          let normalizedStripeStatus: string = stripeStatusRaw;
          if (stripeStatusRaw === 'canceled') normalizedStripeStatus = 'cancelled';
          else if (stripeStatusRaw === 'trialing') normalizedStripeStatus = 'trial';
          else if (stripeStatusRaw === 'incomplete') normalizedStripeStatus = 'trial';
          else if (stripeStatusRaw === 'incomplete_expired') normalizedStripeStatus = 'cancelled';

          if (dbStatus !== normalizedStripeStatus) {
            healthReport.mismatchedStatuses.push({
              email: user.email,
              dbStatus,
              stripeStatus: normalizedStripeStatus,
            });
            healthReport.healthy = false;
          }
        } catch (error: any) {
          if (error.code === 'resource_missing') {
            // Subscription not found in Stripe
            healthReport.usersWithMissingSubscriptions.push(user.email);
            healthReport.healthy = false;
          } else {
            logger.error('[Billing Health] Error checking subscription:', {
              error: error.message,
              email: user.email,
              subscriptionId: user.stripe_subscription_id,
            });
          }
        }
      }
    }

    // Get all active subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      status: 'all',
      limit: 100,
    });

    healthReport.totalSubscriptions = subscriptions.data.length;

    // Check for subscriptions without users
    for (const subscription of subscriptions.data) {
      const customerId = subscription.customer as string;

      const { data: billingData } = await supabaseAdmin
        .from('billing_customers')
        .select('user_email')
        .eq('stripe_customer_id', customerId)
        .maybeSingle();

      if (!billingData) {
        healthReport.subscriptionsWithMissingUsers.push(subscription.id);
        healthReport.healthy = false;
      }
    }

    return NextResponse.json({
      success: true,
      health: healthReport,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const apiError = ApiErrorHandler.fromException(
      error instanceof Error ? error : new Error(String(error)),
    );
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }
}
