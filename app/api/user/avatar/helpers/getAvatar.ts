import { ApiErrorHandler } from '@/lib/api-error-handler';
import { isValidAvatar } from '@/lib/avatars';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Get user avatar from database
 */
export async function getAvatar(userEmail: string): Promise<NextResponse> {
  if (!supabaseAdmin) {
    logger.warn('[Avatar API] Supabase not available, returning null');
    return NextResponse.json({ avatar: null });
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('avatar')
    .eq('email', userEmail)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found" which is fine for first-time users
    const errorMessage = error.message || '';

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
            code: error.code,
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

    logger.error('[Avatar API] Failed to fetch avatar:', {
      error: errorMessage,
      userEmail,
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch avatar', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const avatar = data?.avatar && isValidAvatar(data.avatar) ? data.avatar : null;

  return NextResponse.json({ avatar });
}
