import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { mergePreferences } from './mergePreferences';

/**
 * Update user notification preferences
 */
export async function updatePreferences(userEmail: string, updates: any): Promise<NextResponse> {
  if (!supabaseAdmin) {
    logger.warn('[Notifications API] Supabase not available');
    return NextResponse.json(
      ApiErrorHandler.createError('Database not available', 'SERVICE_UNAVAILABLE', 503),
      { status: 503 },
    );
  }

  // Get current preferences
  const { data: currentData } = await supabaseAdmin
    .from('users')
    .select('notification_preferences')
    .eq('email', userEmail)
    .single();

  const currentPreferences = currentData?.notification_preferences || {};

  // Merge updates with current preferences
  const mergedPreferences = mergePreferences({
    email: {
      ...(currentPreferences.email || {}),
      ...(updates.email || {}),
    },
    inApp: {
      ...(currentPreferences.inApp || {}),
      ...(updates.inApp || {}),
    },
  });

  // Check if user exists, if not create them
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (!existingUser) {
    // Create user record if it doesn't exist
    const { error: createError } = await supabaseAdmin.from('users').insert({
      email: userEmail,
      notification_preferences: mergedPreferences,
      updated_at: new Date().toISOString(),
    });

    if (createError) {
      logger.error('[Notifications API] Failed to create user:', {
        error: createError.message,
        context: { endpoint: '/api/user/notifications', method: 'PUT' },
      });

      return NextResponse.json(
        ApiErrorHandler.createError('Failed to save preferences', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }
  } else {
    // Update existing user
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        notification_preferences: mergedPreferences,
        updated_at: new Date().toISOString(),
      })
      .eq('email', userEmail);

    if (updateError) {
      logger.error('[Notifications API] Failed to update preferences:', {
        error: updateError.message,
        context: { endpoint: '/api/user/notifications', method: 'PUT' },
      });

      return NextResponse.json(
        ApiErrorHandler.createError('Failed to update preferences', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Notification preferences updated successfully',
    preferences: mergedPreferences,
  });
}
