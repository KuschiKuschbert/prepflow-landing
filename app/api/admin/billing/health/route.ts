import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { checkOrphanedSubscriptions } from './helpers/checkOrphanedSubscriptions';
import { checkUserSubscriptions } from './helpers/checkUserSubscriptions';
import { HealthReport } from './types';

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

    // Initialize report
    const healthReport: HealthReport = {
      usersWithMissingSubscriptions: [],
      subscriptionsWithMissingUsers: [],
      mismatchedStatuses: [],
      totalUsers: 0,
      totalSubscriptions: 0,
      healthy: true,
    };

    // 1. Get all users with subscriptions
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('email, subscription_status, stripe_subscription_id')
      .not('stripe_subscription_id', 'is', null);

    if (usersError) {
      logger.error('[Billing Health] Failed to fetch users:', { error: usersError.message });
    } else {
      healthReport.totalUsers = users?.length || 0;

      // Check users against Stripe
      const usersCheck = await checkUserSubscriptions(users || [], stripe);
      healthReport.mismatchedStatuses = usersCheck.mismatchedStatuses;
      healthReport.usersWithMissingSubscriptions = usersCheck.usersWithMissingSubscriptions;
      if (!usersCheck.healthy) healthReport.healthy = false;
    }

    // 2. Get all active subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      status: 'all',
      limit: 100,
    });

    healthReport.totalSubscriptions = subscriptions.data.length;

    // Check for orphaned subscriptions
    const orphansCheck = await checkOrphanedSubscriptions(subscriptions.data, supabaseAdmin);
    healthReport.subscriptionsWithMissingUsers = orphansCheck.subscriptionsWithMissingUsers;
    if (!orphansCheck.healthy) healthReport.healthy = false;

    return NextResponse.json({
      success: true,
      health: healthReport,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    const apiError = ApiErrorHandler.fromException(
      error instanceof Error ? error : new Error(String(error)),
    );
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }
}
