import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { isValidAvatar } from '@/lib/avatars';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const avatarSchema = z.object({
  avatar: z.string().nullable(),
});

/**
 * GET /api/user/avatar
 * Get current user's avatar preference
 *
 * @returns {Promise<NextResponse>} User avatar preference
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
  } catch (error) {
    logger.error('[Avatar API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}

/**
 * PUT /api/user/avatar
 * Update user's avatar preference
 *
 * @param {NextRequest} req - Request object
 * @param {Object} req.body - Request body (validated against avatarSchema)
 * @param {string | null} req.body.avatar - Avatar ID (e.g., "avatar-01") or null
 * @returns {Promise<NextResponse>} Updated avatar preference
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
    const body = await req.json().catch(() => ({}));
    const validationResult = avatarSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { avatar } = validationResult.data;

    // Validate avatar ID if provided
    if (avatar !== null && !isValidAvatar(avatar)) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid avatar ID', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      logger.error('[Avatar API] Supabase not available');
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 503),
        { status: 503 },
      );
    }

    // Check if user exists first
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', userEmail)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" which is fine - we'll create the user
      logger.error('[Avatar API] Failed to check user existence:', {
        error: checkError.message,
        errorCode: checkError.code,
        userEmail,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to check user', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // If user doesn't exist, create them
    if (!existingUser) {
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          email: userEmail,
          avatar: avatar || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('avatar')
        .single();

      if (createError) {
        logger.error('[Avatar API] Failed to create user:', {
          error: createError.message,
          errorCode: createError.code,
          userEmail,
        });
        return NextResponse.json(
          ApiErrorHandler.createError(
            `Failed to create user: ${createError.message}`,
            'DATABASE_ERROR',
            500,
          ),
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        avatar: newUser?.avatar || null,
      });
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
        const { data: newUser, error: createError } = await supabaseAdmin
          .from('users')
          .insert({
            email: userEmail,
            avatar: avatar || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select('avatar')
          .single();

        if (createError) {
          return NextResponse.json(
            ApiErrorHandler.createError(
              `Failed to create user: ${createError.message}`,
              'DATABASE_ERROR',
              500,
            ),
            { status: 500 },
          );
        }

        return NextResponse.json({
          success: true,
          avatar: newUser?.avatar || null,
        });
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
  } catch (error) {
    logger.error('[Avatar API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
