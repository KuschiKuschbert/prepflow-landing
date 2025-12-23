import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { createUserIfNotExists } from './createUser';

/**
 * Update user avatar in database
 */
export async function updateAvatar(
  userEmail: string,
  avatar: string | null,
): Promise<NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  // Check if user exists
  const { data: existingUser, error: checkError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', userEmail)
    .maybeSingle();

  if (checkError && checkError.code !== 'PGRST116') {
    // PGRST116 is "not found" - that's okay, we'll create the user
    logger.error('[Avatar API] Error checking if user exists:', {
      error: checkError.message,
      userEmail,
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to check user', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  // User doesn't exist, create them
  if (!existingUser) {
    logger.dev('[Avatar API] User does not exist, creating:', { userEmail });
    return await createUserIfNotExists(userEmail, avatar);
  }

  // User exists, update avatar
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({
      avatar: avatar || null,
      updated_at: new Date().toISOString(),
    })
    .eq('email', userEmail)
    .select('avatar')
    .single();

  if (error) {
    logger.error('[helpers/updateAvatar] Database error:', {
      error: error.message,
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  if (error) {
    const errorMessage = error.message || '';
    const errorCode = error.code || '';
    const errorDetails = error.details || '';

    logger.error('[Avatar API] Failed to update avatar:', {
      error: errorMessage,
      errorCode,
      errorDetails,
      userEmail,
      avatarId: avatar,
    });

    // Check if it's a column-not-found error
    if (
      errorMessage.includes('column') &&
      (errorMessage.includes('does not exist') ||
        errorMessage.includes('not found') ||
        errorMessage.includes('unknown column'))
    ) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Avatar column not found. Please run the migration script.',
          'COLUMN_NOT_FOUND',
          400,
          {
            error: errorMessage,
            code: errorCode,
            missingColumn: 'avatar',
            instructions: [
              'The users table is missing the avatar column.',
              'Please run the migration SQL in Supabase SQL Editor:',
              '1. Visit http://localhost:3000/api/setup-user-avatar to get the SQL',
              '2. Or open migrations/add-user-avatar.sql',
              '3. Copy the SQL and run it in Supabase SQL Editor',
              '4. Refresh the page and try again',
            ],
          },
        ),
        { status: 400 },
      );
    }

    // Handle PGRST116 (0 rows) - user was deleted between check and update
    if (errorCode === 'PGRST116') {
      logger.warn('[Avatar API] User was deleted between check and update, creating new user:', {
        userEmail,
      });
      // Try to create the user again
      return await createUserIfNotExists(userEmail, avatar);
    }

    return NextResponse.json(
      ApiErrorHandler.createError(
        `Failed to update avatar: ${errorMessage}`,
        'DATABASE_ERROR',
        500,
      ),
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    avatar: data?.avatar || null,
  });
}
