import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { createUser } from './createUser';
import { formatProfileResponse } from './formatProfileResponse';
import { profileUpdateSchema } from './types';

/**
 * Update user profile
 */
export async function updateProfile(userEmail: string, body: unknown): Promise<NextResponse> {
  // Validate request body
  const validationResult = profileUpdateSchema.safeParse(body);
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
    logger.warn('[Profile API] Supabase not available');
    return NextResponse.json(
      ApiErrorHandler.createError('Database not available', 'SERVICE_UNAVAILABLE', 503),
      { status: 503 },
    );
  }

  // Check if user exists, if not create them
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (!existingUser) {
    // Create user record if it doesn't exist
    return await createUser(userEmail, updates);
  }

  // Update existing user
  const { data: updatedUser, error: updateError } = await supabaseAdmin
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('email', userEmail)
    .select('first_name, last_name, business_name, email, created_at, last_login, email_verified')
    .single();

  if (updateError) {
    logger.error('[Profile API] Failed to update profile:', {
      error: updateError.message,
      context: { endpoint: '/api/user/profile', method: 'PUT' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Failed to update profile', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Profile updated successfully',
    profile: formatProfileResponse(updatedUser, userEmail),
  });
}
