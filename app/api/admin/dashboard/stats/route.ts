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
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get active subscriptions count (users with active subscription_status)
    const { count: activeSubscriptions } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .in('subscription_status', ['active', 'trialing']);

    // Get critical errors count (Safety + Critical, status = new or investigating)
    const { count: criticalErrors } = await supabaseAdmin
      .from('admin_error_logs')
      .select('*', { count: 'exact', head: true })
      .in('severity', ['safety', 'critical'])
      .in('status', ['new', 'investigating']);

    // Get unresolved tickets count (open or investigating)
    const { count: unresolvedTickets } = await supabaseAdmin
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .in('status', ['open', 'investigating']);

    // Get recent safety errors (last 5, status = new or investigating)
    const { data: recentSafetyErrors } = await supabaseAdmin
      .from('admin_error_logs')
      .select('id, error_message, severity, status, created_at')
      .eq('severity', 'safety')
      .in('status', ['new', 'investigating'])
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent errors count (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const { count: recentErrors } = await supabaseAdmin
      .from('admin_error_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo.toISOString());

    // Get total data records across all tables
    const tables = ['ingredients', 'recipes', 'menu_dishes', 'temperature_logs', 'cleaning_tasks'];
    let totalDataRecords = 0;

    for (const table of tables) {
      try {
        const { count } = await supabaseAdmin
          .from(table)
          .select('*', { count: 'exact', head: true });
        totalDataRecords += count || 0;
      } catch (error) {
        // Table might not exist, skip it
        logger.warn(`[Admin Dashboard] Could not count records in ${table}:`, error);
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
