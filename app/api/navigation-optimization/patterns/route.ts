import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/navigation-optimization/patterns
 * Get navigation usage patterns for adaptive optimization
 *
 * @returns {Promise<NextResponse>} Navigation patterns data
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const userId = user.email;

    if (!supabaseAdmin) {
      logger.error('[Navigation Optimization API] Supabase not available');
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 503),
        { status: 503 },
      );
    }

    // Get logs from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabaseAdmin
      .from('navigation_usage_logs')
      .select('href, timestamp, day_of_week, hour_of_day, time_spent, return_frequency')
      .eq('user_id', userId)
      .gte('timestamp', thirtyDaysAgo.toISOString())
      .order('timestamp', { ascending: false })
      .limit(1000); // Limit to last 1000 logs

    if (error) {
      logger.error('[Navigation Optimization API] Failed to fetch patterns:', {
        error: error.message,
        userId,
      });

    if (error) {
      logger.error('[patterns/route] Database error:', {
        error: error.message,
      });
      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch usage patterns', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Convert to NavigationUsageLog format
    const logs =
      data?.map(log => ({
        href: log.href,
        timestamp: new Date(log.timestamp).getTime(),
        dayOfWeek: log.day_of_week,
        hourOfDay: log.hour_of_day,
        timeSpent: log.time_spent || undefined,
        returnFrequency: log.return_frequency || undefined,
      })) || [];

    return NextResponse.json({ logs });
  } catch (error) {
    logger.error('[Navigation Optimization API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
