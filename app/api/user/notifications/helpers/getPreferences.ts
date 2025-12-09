import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { getDefaultPreferences } from './getDefaultPreferences';
import { mergePreferences } from './mergePreferences';

/**
 * Get user notification preferences
 */
export async function getPreferences(userEmail: string): Promise<NextResponse> {
  if (!supabaseAdmin) {
    logger.warn('[Notifications API] Supabase not available');
    const defaultPreferences = getDefaultPreferences();
    return NextResponse.json({
      preferences: defaultPreferences,
      note: 'Database not available. Using default preferences.',
    });
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('notification_preferences')
    .eq('email', userEmail)
    .single();

  if (error && error.code !== 'PGRST116') {
    logger.error('[Notifications API] Failed to fetch preferences:', {
      error: error.message,
      context: { endpoint: '/api/user/notifications', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch preferences', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const defaultPreferences = getDefaultPreferences();
  const preferences = data?.notification_preferences || defaultPreferences;
  const mergedPreferences = mergePreferences(preferences);

  return NextResponse.json({
    preferences: mergedPreferences,
  });
}
