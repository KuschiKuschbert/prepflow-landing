import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const notificationPreferencesSchema = z.object({
  email: z
    .object({
      weeklyReports: z.boolean().optional(),
      securityAlerts: z.boolean().optional(),
      featureUpdates: z.boolean().optional(),
      marketing: z.boolean().optional(),
    })
    .optional(),
  inApp: z
    .object({
      personalityToasts: z.boolean().optional(),
      arcadeSounds: z.boolean().optional(),
      emailDigest: z.enum(['daily', 'weekly', 'monthly', 'never']).optional(),
    })
    .optional(),
});

/**
 * GET /api/user/notifications
 * Get current user's notification preferences
 *
 * @returns {Promise<NextResponse>} Notification preferences
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const userEmail = session.user.email;

    if (!supabaseAdmin) {
      logger.warn('[Notifications API] Supabase not available');
      return NextResponse.json({
        preferences: {
          email: {
            weeklyReports: true,
            securityAlerts: true,
            featureUpdates: true,
            marketing: false,
          },
          inApp: {
            personalityToasts: true,
            arcadeSounds: true,
            emailDigest: 'weekly',
          },
        },
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

    // Default preferences if not set
    const defaultPreferences = {
      email: {
        weeklyReports: true,
        securityAlerts: true,
        featureUpdates: true,
        marketing: false,
      },
      inApp: {
        personalityToasts: true,
        arcadeSounds: true,
        emailDigest: 'weekly' as const,
      },
    };

    const preferences = data?.notification_preferences || defaultPreferences;

    // Merge with defaults to ensure all fields exist
    const mergedPreferences = {
      email: {
        ...defaultPreferences.email,
        ...(preferences.email || {}),
      },
      inApp: {
        ...defaultPreferences.inApp,
        ...(preferences.inApp || {}),
      },
    };

    return NextResponse.json({
      preferences: mergedPreferences,
    });
  } catch (error) {
    logger.error('[Notifications API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/notifications', method: 'GET' },
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

/**
 * PUT /api/user/notifications
 * Update current user's notification preferences
 *
 * @param {NextRequest} req - Request object with preferences
 * @returns {Promise<NextResponse>} Updated preferences
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const userEmail = session.user.email;
    const body = await req.json();

    // Validate request body
    const validationResult = notificationPreferencesSchema.safeParse(body);
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

    const updates = validationResult.data;

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
    const mergedPreferences = {
      email: {
        ...(currentPreferences.email || {}),
        ...(updates.email || {}),
      },
      inApp: {
        ...(currentPreferences.inApp || {}),
        ...(updates.inApp || {}),
      },
    };

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
  } catch (error) {
    logger.error('[Notifications API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/notifications', method: 'PUT' },
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
