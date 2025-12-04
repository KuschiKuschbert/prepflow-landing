import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const profileUpdateSchema = z.object({
  first_name: z.string().max(100).optional(),
  last_name: z.string().max(100).optional(),
  business_name: z.string().max(255).optional(),
});

/**
 * GET /api/user/profile
 * Get current user's profile information
 *
 * @returns {Promise<NextResponse>} User profile data
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
      logger.warn('[Profile API] Supabase not available');
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'SERVICE_UNAVAILABLE', 503),
        { status: 503 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('first_name, last_name, business_name, email, created_at, last_login, email_verified')
      .eq('email', userEmail)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // User not found in database, return session data only
        return NextResponse.json({
          email: userEmail,
          first_name: null,
          last_name: null,
          business_name: null,
          created_at: null,
          last_login: null,
          email_verified: false,
        });
      }

      logger.error('[Profile API] Failed to fetch profile:', {
        error: error.message,
        context: { endpoint: '/api/user/profile', method: 'GET' },
      });

      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch profile', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json({
      email: data.email || userEmail,
      first_name: data.first_name,
      last_name: data.last_name,
      business_name: data.business_name,
      created_at: data.created_at,
      last_login: data.last_login,
      email_verified: data.email_verified || false,
    });
  } catch (error) {
    logger.error('[Profile API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/profile', method: 'GET' },
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
 * PUT /api/user/profile
 * Update current user's profile information
 *
 * @param {NextRequest} req - Request object with profile data
 * @returns {Promise<NextResponse>} Updated profile data
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
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          email: userEmail,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select(
          'first_name, last_name, business_name, email, created_at, last_login, email_verified',
        )
        .single();

      if (createError) {
        logger.error('[Profile API] Failed to create user:', {
          error: createError.message,
          context: { endpoint: '/api/user/profile', method: 'PUT' },
        });

        return NextResponse.json(
          ApiErrorHandler.createError('Failed to create user profile', 'DATABASE_ERROR', 500),
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Profile created successfully',
        profile: {
          email: newUser.email || userEmail,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          business_name: newUser.business_name,
          created_at: newUser.created_at,
          last_login: newUser.last_login,
          email_verified: newUser.email_verified || false,
        },
      });
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
      profile: {
        email: updatedUser.email || userEmail,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        business_name: updatedUser.business_name,
        created_at: updatedUser.created_at,
        last_login: updatedUser.last_login,
        email_verified: updatedUser.email_verified || false,
      },
    });
  } catch (error) {
    logger.error('[Profile API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/profile', method: 'PUT' },
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
