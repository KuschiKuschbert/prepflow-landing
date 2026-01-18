import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export async function fetchUserCounts() {
  if (!supabaseAdmin) return { totalUsers: 0, activeSubscriptions: 0 };

  const [totalUsersRes, activeSubsRes] = await Promise.all([
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
    supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .in('subscription_status', ['active', 'trialing']),
  ]);

  if (totalUsersRes.error) {
    logger.warn('[Admin Dashboard Stats] Error fetching total users count:', {
      error: totalUsersRes.error.message,
      code: (totalUsersRes.error as PostgrestError).code,
    });
  }

  if (activeSubsRes.error) {
    logger.warn('[Admin Dashboard Stats] Error fetching active subscriptions count:', {
      error: activeSubsRes.error.message,
      code: (activeSubsRes.error as PostgrestError).code,
    });
  }

  return {
    totalUsers: totalUsersRes.count || 0,
    activeSubscriptions: activeSubsRes.count || 0,
  };
}

export async function fetchErrorCounts() {
  if (!supabaseAdmin) return { criticalErrors: 0, recentErrors: 0 };

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const [criticalRes, recentRes] = await Promise.all([
    supabaseAdmin
      .from('admin_error_logs')
      .select('*', { count: 'exact', head: true })
      .in('severity', ['safety', 'critical'])
      .in('status', ['new', 'investigating']),
    supabaseAdmin
      .from('admin_error_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo.toISOString()),
  ]);

  if (criticalRes.error) {
    logger.warn('[Admin Dashboard Stats] Error fetching critical errors count:', {
      error: criticalRes.error.message,
      code: (criticalRes.error as PostgrestError).code,
    });
  }

  if (recentRes.error) {
    logger.warn('[Admin Dashboard Stats] Error fetching recent errors count:', {
      error: recentRes.error.message,
      code: (recentRes.error as PostgrestError).code,
    });
  }

  return {
    criticalErrors: criticalRes.count || 0,
    recentErrors: recentRes.count || 0,
  };
}

export async function fetchTicketCounts() {
  if (!supabaseAdmin) return { unresolvedTickets: 0 };

  const { count: unresolvedTickets, error: ticketsError } = await supabaseAdmin
    .from('support_tickets')
    .select('*', { count: 'exact', head: true })
    .in('status', ['open', 'investigating']);

  if (ticketsError) {
    logger.warn('[Admin Dashboard Stats] Error fetching unresolved tickets count:', {
      error: ticketsError.message,
      code: (ticketsError as PostgrestError).code,
    });
  }

  return { unresolvedTickets: unresolvedTickets || 0 };
}

export async function fetchRecentSafetyErrors() {
  if (!supabaseAdmin) return [];

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
      code: (safetyErrorsError as PostgrestError).code,
    });
  }

  return recentSafetyErrors || [];
}

export async function fetchTotalDataRecords() {
  if (!supabaseAdmin) return 0;

  const tables = ['ingredients', 'recipes', 'menu_dishes', 'temperature_logs', 'cleaning_tasks'];
  const countPromises = tables.map(async table => {
    try {
      const { count, error } = await supabaseAdmin!
        .from(table)
        .select('*', { count: 'exact', head: true });
      if (error) {
        logger.warn(`[Admin Dashboard Stats] Error counting records in ${table}:`, {
          error: error.message,
        });
        return 0;
      }
      return count || 0;
    } catch (error) {
      logger.warn(`[Admin Dashboard Stats] Could not count records in ${table}:`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return 0;
    }
  });

  const counts = await Promise.all(countPromises);
  return counts.reduce((a, b) => a + b, 0);
}

export async function checkSystemHealth() {
  if (!supabaseAdmin) return 'down';

  const { error } = await supabaseAdmin.from('users').select('id').limit(1);
  return error ? 'down' : 'healthy';
}
