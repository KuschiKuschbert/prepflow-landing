import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/analytics
 * Get usage analytics and metrics
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    // Get total users count
    const { count: totalUsers, error: totalUsersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (totalUsersError) {
      logger.warn('[Admin Analytics] Error fetching total users count:', {
        error: totalUsersError.message,
        code: totalUsersError.code,
      });
    }

    // Get active users (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { count: activeUsers, error: activeUsersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_login', thirtyDaysAgo);

    if (activeUsersError) {
      logger.warn('[Admin Analytics] Error fetching active users count:', {
        error: activeUsersError.message,
        code: activeUsersError.code,
      });
    }

    // Get data counts
    const [ingredientsResult, recipesResult, dishesResult] = await Promise.all([
      supabase.from('ingredients').select('*', { count: 'exact', head: true }),
      supabase.from('recipes').select('*', { count: 'exact', head: true }),
      supabase.from('dishes').select('*', { count: 'exact', head: true }),
    ]);

    if (ingredientsResult.error) {
      logger.warn('[Admin Analytics] Error fetching ingredients count:', {
        error: ingredientsResult.error.message,
        code: ingredientsResult.error.code,
      });
    }
    if (recipesResult.error) {
      logger.warn('[Admin Analytics] Error fetching recipes count:', {
        error: recipesResult.error.message,
        code: recipesResult.error.code,
      });
    }
    if (dishesResult.error) {
      logger.warn('[Admin Analytics] Error fetching dishes count:', {
        error: dishesResult.error.message,
        code: dishesResult.error.code,
      });
    }

    // Feature usage (simplified - can be enhanced with actual tracking)
    const featureUsage = [
      { feature: 'Ingredients Management', usage: ingredientsResult.count || 0 },
      { feature: 'Recipe Management', usage: recipesResult.count || 0 },
      { feature: 'Menu Builder', usage: dishesResult.count || 0 },
    ];

    // User activity (simplified - last 7 days)
    const userActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      userActivity.push({
        date: date.toISOString().split('T')[0],
        activeUsers: Math.floor(Math.random() * (totalUsers || 0)), // Placeholder - would need actual tracking
      });
    }

    return NextResponse.json({
      success: true,
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      totalIngredients: ingredientsResult.count || 0,
      totalRecipes: recipesResult.count || 0,
      totalDishes: dishesResult.count || 0,
      userActivity,
      featureUsage,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Admin Analytics API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/analytics', method: 'GET' },
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
