import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { mergePreferences } from './mergePreferences';
import type { NotificationPreferences } from './types';

/**
 * Update user notification preferences
 */
export async function updatePreferences(userEmail: string, updates: NotificationPreferences): Promise<NextResponse> {
  if (!supabaseAdmin) {
    logger.warn('[Notifications API] Supabase not available');
    return NextResponse.json(
      ApiErrorHandler.createError('Database not available', 'SERVICE_UNAVAILABLE', 503),
      { status: 503 },
    );
  }

  // Get current preferences
  const { data: currentData, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('notification_preferences')
    .eq('email', userEmail)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 is "not found" - that's okay, we'll create the user
    logger.warn('[Notifications API] Error fetching current preferences:', {
      error: fetchError.message,
      userEmail,
    });
  }

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
  const { data: existingUser, error: checkError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    // PGRST116 is "not found" - that's okay, we'll create the user
    logger.error('[Notifications API] Error checking if user exists:', {
      error: checkError.message,
      userEmail,
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to check user', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

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
