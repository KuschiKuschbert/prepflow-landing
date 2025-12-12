import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getEntitlementsForTierAsync } from '@/lib/entitlements';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { TierSlug } from '@/lib/tier-config';
import { getUsage } from '@/lib/usage-tracker';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/user/subscription
 * Get current user's subscription details
 *
 * @returns {Promise<NextResponse>} Subscription details
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const userEmail = user.email;

    if (!supabaseAdmin) {
      logger.warn('[Subscription API] Supabase not available');
      return NextResponse.json({
        subscription: {
          tier: 'starter',
          status: 'trial',
          expires_at: null,
          created_at: null,
        },
        entitlements: {
          userId: userEmail,
          tier: 'starter',
          features: {
            cogs: true,
            recipes: true,
            analytics: true,
            temperature: true,
            cleaning: true,
            compliance: true,
          },
          limits: { recipes: 50, ingredients: 200 },
        },
        usage: {
          ingredients: 0,
          recipes: 0,
          dishes: 0,
        },
        note: 'Database not available. Using default subscription.',
      });
    }

    // Get user subscription data
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select(
        'subscription_status, subscription_expires, subscription_tier, subscription_cancel_at_period_end, subscription_current_period_start, created_at',
      )
      .eq('email', userEmail)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      logger.error('[Subscription API] Failed to fetch subscription:', {
        error: userError.message,
        context: { endpoint: '/api/user/subscription', method: 'GET' },
      });
    }

    // Get actual tier from database, fallback to 'starter'
    const tier = (userData?.subscription_tier as TierSlug) || 'starter';
    const status = userData?.subscription_status || 'trial';
    const expiresAt = userData?.subscription_expires || null;
    const cancelAtPeriodEnd = userData?.subscription_cancel_at_period_end || false;
    const currentPeriodStart = userData?.subscription_current_period_start || null;

    // Get usage metrics using usage tracker
    const usage = await getUsage(userEmail);

    // Get entitlements using database config (with code fallback)
    const entitlements = await getEntitlementsForTierAsync(userEmail, tier);

    return NextResponse.json({
      subscription: {
        tier,
        status,
        expires_at: expiresAt,
        created_at: userData?.created_at || null,
        cancel_at_period_end: cancelAtPeriodEnd,
        current_period_start: currentPeriodStart,
      },
      entitlements,
      usage,
    });
  } catch (error) {
    logger.error('[Subscription API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/subscription', method: 'GET' },
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
