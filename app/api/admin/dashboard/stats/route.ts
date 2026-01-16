import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/dashboard/stats
 * Get admin dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Require admin access
    await requireAdmin(request);

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Get total users count
    const { count: totalUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) {
      logger.warn('[Admin Dashboard Stats] Error fetching total users count:', {
        error: usersError.message,
        code: (usersError as unknown).code,
      });
    }

    // Get active subscriptions count (users with active subscription_status)
    const { count: activeSubscriptions, error: subscriptionsError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .in('subscription_status', ['active', 'trialing']);

    if (subscriptionsError) {
      logger.warn('[Admin Dashboard Stats] Error fetching active subscriptions count:', {
        error: subscriptionsError.message,
        code: (subscriptionsError as unknown).code,
      });
    }

    // Get critical errors count (Safety + Critical, status = new or investigating)
    const { count: criticalErrors, error: criticalErrorsQueryError } = await supabaseAdmin
      .from('admin_error_logs')
      .select('*', { count: 'exact', head: true })
      .in('severity', ['safety', 'critical'])
      .in('status', ['new', 'investigating']);

    if (criticalErrorsQueryError) {
      logger.warn('[Admin Dashboard Stats] Error fetching critical errors count:', {
        error: criticalErrorsQueryError.message,
        code: (criticalErrorsQueryError as unknown).code,
      });
    }

    // Get unresolved tickets count (open or investigating)
    const { count: unresolvedTickets, error: ticketsError } = await supabaseAdmin
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .in('status', ['open', 'investigating']);

    if (ticketsError) {
      logger.warn('[Admin Dashboard Stats] Error fetching unresolved tickets count:', {
        error: ticketsError.message,
        code: (ticketsError as unknown).code,
      });
    }

    // Get recent safety errors (last 5, status = new or investigating)
    const { data: recentSafetyErrors, error: safetyErrorsError } = await supabaseAdmin
      .from('admin_error_logs')
      .select('id, error_message, severity, status, created_at')
      .eq('severity', 'safety')
      .in('status', ['new', 'investigating'])
      .order('created_at', { ascending: false })
      .limit(5);

    if (safetyErrorsError) {
      logger.warn('[Admin Dashboard Stats] Error fetching recent safety errors:', {
        error: safetyErrorsError.message,
        code: (safetyErrorsError as unknown).code,
      });
    }

    // Get recent errors count (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const { count: recentErrors, error: recentErrorsQueryError } = await supabaseAdmin
      .from('admin_error_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo.toISOString());

    if (recentErrorsQueryError) {
      logger.warn('[Admin Dashboard Stats] Error fetching recent errors count:', {
        error: recentErrorsQueryError.message,
        code: (recentErrorsQueryError as unknown).code,
      });
    }

    // Get total data records across all tables
    const tables = ['ingredients', 'recipes', 'menu_dishes', 'temperature_logs', 'cleaning_tasks'];
    let totalDataRecords = 0;

    for (const table of tables) {
      try {
        const { count, error: tableError } = await supabaseAdmin
          .from(table)
          .select('*', { count: 'exact', head: true });
        if (tableError) {
          logger.warn(`[Admin Dashboard Stats] Error counting records in ${table}:`, {
            error: tableError.message,
            code: (tableError as unknown).code,
          });
        } else {
          totalDataRecords += count || 0;
        }
      } catch (error) {
        // Table might not exist, skip it
        logger.warn(`[Admin Dashboard Stats] Could not count records in ${table}:`, {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // System health check - simple database connectivity test
    const { error: healthError } = await supabaseAdmin.from('users').select('id').limit(1);

    const systemHealth = healthError ? 'down' : 'healthy';

    return NextResponse.json({
      success: true,
      totalUsers: totalUsers || 0,
      activeSubscriptions: activeSubscriptions || 0,
      systemHealth,
      recentErrors: recentErrors || 0,
      totalDataRecords,
      criticalErrors: criticalErrors || 0,
      unresolvedTickets: unresolvedTickets || 0,
      recentSafetyErrors: recentSafetyErrors || [],
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Admin Dashboard Stats] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/dashboard/stats', method: 'GET' },
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
