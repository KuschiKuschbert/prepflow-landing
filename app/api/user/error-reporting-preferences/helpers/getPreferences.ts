import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Get user's error reporting preferences
 */
export async function getPreferences(userEmail: string): Promise<NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  // Get user's notification preferences
  const { data: userData, error } = await supabaseAdmin
    .from('users')
    .select('notification_preferences')
    .eq('email', userEmail)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found" - user might not exist yet
    logger.error('[Error Reporting Preferences API] Database error:', {
      error: error.message,
      context: { endpoint: '/api/user/error-reporting-preferences', method: 'GET' },
    });

    return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
  }

  // Extract auto-report preference from notification_preferences JSONB
  const preferences = (userData?.notification_preferences as Record<string, unknown>) || {};
  const errorReporting = (preferences.errorReporting as Record<string, unknown>) || {};
  const autoReport = Boolean(errorReporting.autoReport);

  return NextResponse.json({
    success: true,
    autoReport,
  });
}
