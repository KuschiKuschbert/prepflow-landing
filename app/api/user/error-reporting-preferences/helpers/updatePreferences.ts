import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updatePreferencesSchema = z.object({
  autoReport: z.boolean(),
});

/**
 * Update user's error reporting preferences
 */
export async function updatePreferences(userEmail: string, body: unknown): Promise<NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  // Validate request body
  const validationResult = updatePreferencesSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Invalid request data',
        'VALIDATION_ERROR',
        400,
        validationResult.error.issues,
      ),
      { status: 400 },
    );
  }

  const { autoReport } = validationResult.data;

  // Get existing user preferences
  const { data: existingUser, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('notification_preferences, id')
    .eq('email', userEmail)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 is "not found" - that's okay, we'll create the user
    logger.error('[Error Reporting Preferences API] Error fetching user preferences:', {
      error: fetchError.message,
      userEmail,
    });
    return NextResponse.json(ApiErrorHandler.fromSupabaseError(fetchError, 500), {
      status: 500,
    });
  }

  const existingPreferences =
    (existingUser?.notification_preferences as Record<string, unknown>) || {};
  const updatedPreferences = {
    ...existingPreferences,
    errorReporting: {
      ...((existingPreferences.errorReporting as Record<string, unknown>) || {}),
      autoReport,
    },
  };

  // Update user preferences
  if (existingUser) {
    // User exists - update
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        notification_preferences: updatedPreferences,
        updated_at: new Date().toISOString(),
      })
      .eq('email', userEmail);

    if (updateError) {
      logger.error('[Error Reporting Preferences API] Failed to update preferences:', {
        error: updateError.message,
        context: { endpoint: '/api/user/error-reporting-preferences', method: 'PUT' },
      });

      return NextResponse.json(ApiErrorHandler.fromSupabaseError(updateError, 500), {
        status: 500,
      });
    }
  } else {
    // User doesn't exist - create with preferences
    const { error: createError } = await supabaseAdmin.from('users').insert({
      email: userEmail,
      notification_preferences: updatedPreferences,
      updated_at: new Date().toISOString(),
    });

    if (createError) {
      logger.error('[Error Reporting Preferences API] Failed to create user:', {
        error: createError.message,
        context: { endpoint: '/api/user/error-reporting-preferences', method: 'PUT' },
      });

      return NextResponse.json(ApiErrorHandler.fromSupabaseError(createError, 500), {
        status: 500,
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Error reporting preferences updated successfully',
    autoReport,
  });
}
