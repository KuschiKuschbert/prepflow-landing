import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { fetchBillingStats } from './helpers/fetchBillingData';
import { fetchStripeData } from './helpers/processStripeData';

/**
 * GET /api/admin/billing/overview
 * Get billing overview and subscription statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { error } = await standardAdminChecks(request);
    if (error) return error;

    // Parallelize DB and Stripe fetching
    const [dbStats, stripeStats] = await Promise.all([fetchBillingStats(), fetchStripeData()]);

    return NextResponse.json({
      success: true,
      totalRevenue: Math.round(stripeStats.totalRevenue),
      monthlyRecurringRevenue: Math.round(stripeStats.monthlyRecurringRevenue),
      activeSubscriptions: dbStats.activeSubscriptions,
      trialSubscriptions: dbStats.trialSubscriptions,
      cancelledSubscriptions: dbStats.cancelledSubscriptions,
      failedPayments: stripeStats.failedPayments,
      subscriptions: stripeStats.subscriptions,
      note: stripeStats.hasStripe
        ? 'Stripe data included'
        : 'Stripe not configured - showing database data only',
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
