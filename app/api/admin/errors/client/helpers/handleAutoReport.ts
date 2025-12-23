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

  try {
    // Get user's auto-report preference
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('notification_preferences')
      .eq('id', userId)
      .single();

    const preferences = (userData?.notification_preferences as Record<string, unknown>) || {};
    const errorReporting = (preferences.errorReporting as Record<string, unknown>) || {};
    const autoReport = Boolean(errorReporting.autoReport);

    if (!autoReport) {
      return;
    }

    // Automatically create support ticket (non-blocking)
    (async () => {
      try {
        await fetch('/api/user/errors/auto-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error_id: errorId }),
        });
      } catch (err) {
        // Silently fail - don't break error logging
        logger.dev('[Client Error API] Failed to auto-report error:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    })();
  } catch (err) {
    // Silently fail - don't break error logging
    logger.dev('[Client Error API] Failed to check auto-report preference:', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

