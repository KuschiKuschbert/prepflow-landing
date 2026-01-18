import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Handle auto-reporting for critical/safety errors
 *
 * @param {string} userId - User ID
 * @param {string} errorId - Error log ID
 * @param {string} severity - Error severity
 */
export async function handleAutoReport(
  userId: string,
  errorId: string,
  severity: string,
): Promise<void> {
  // Only auto-report critical/safety errors
  if (severity !== 'critical' && severity !== 'safety') {
    return;
  }

  // Check preference and send report if enabled
  try {
    const shouldReport = await checkAutoReportPreference(userId);
    if (shouldReport) {
      // Non-blocking fire-and-forget
      sendAutoReport(errorId).catch(err => {
        logger.dev('[Client Error API] Failed to auto-report error:', {
          error: err instanceof Error ? err.message : String(err),
        });
      });
    }
  } catch (err) {
    logger.dev('[Client Error API] Failed to check auto-report preference:', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

async function checkAutoReportPreference(userId: string): Promise<boolean> {
  if (!supabaseAdmin) {
    logger.warn('[Client Error API] Database connection not available for auto-report');
    return false;
  }

  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('notification_preferences')
    .eq('id', userId)
    .single();

  const preferences = (userData?.notification_preferences as Record<string, unknown>) || {};
  const errorReporting = (preferences.errorReporting as Record<string, unknown>) || {};
  return Boolean(errorReporting.autoReport);
}

async function sendAutoReport(errorId: string): Promise<void> {
  await fetch('/api/user/errors/auto-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error_id: errorId }),
  });
}
