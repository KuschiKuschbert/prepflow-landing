import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { getEntitlementsForTier } from '@/lib/entitlements';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

/**
 * GET /api/user/subscription
 * Get current user's subscription details
 *
 * @returns {Promise<NextResponse>} Subscription details
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const userEmail = session.user.email as string;

    if (!supabaseAdmin) {
      logger.warn('[Subscription API] Supabase not available');
      return NextResponse.json({
        subscription: {
          tier: 'starter',
          status: 'trial',
          expires_at: null,
          created_at: null,
        },
        entitlements: getEntitlementsForTier(userEmail, 'starter'),
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
      .select('subscription_status, subscription_expires, created_at')
      .eq('email', userEmail)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      logger.error('[Subscription API] Failed to fetch subscription:', {
        error: userError.message,
        context: { endpoint: '/api/user/subscription', method: 'GET' },
      });
    }

    const tier = 'starter' as const; // Default until Stripe is fully wired
    const status = userData?.subscription_status || 'trial';
    const expiresAt = userData?.subscription_expires || null;

    // Get usage metrics
    let usage = {
      ingredients: 0,
      recipes: 0,
      dishes: 0,
    };

    try {
      // Count ingredients
      const { count: ingredientsCount } = await supabaseAdmin
        .from('ingredients')
        .select('*', { count: 'exact', head: true });

      // Count recipes
      const { count: recipesCount } = await supabaseAdmin
        .from('recipes')
        .select('*', { count: 'exact', head: true });

      // Count dishes
      const { count: dishesCount } = await supabaseAdmin
        .from('menu_dishes')
        .select('*', { count: 'exact', head: true });

      usage = {
        ingredients: ingredientsCount || 0,
        recipes: recipesCount || 0,
        dishes: dishesCount || 0,
      };
    } catch (usageError) {
      logger.warn('[Subscription API] Failed to fetch usage metrics:', usageError);
    }

    return NextResponse.json({
      subscription: {
        tier,
        status,
        expires_at: expiresAt,
        created_at: userData?.created_at || null,
      },
      entitlements: getEntitlementsForTier(userEmail, tier),
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

