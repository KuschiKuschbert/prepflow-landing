import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Create user if not exists (used when updating avatar for new users)
 */
export async function createUserIfNotExists(
  userEmail: string,
  avatar: string | null,
): Promise<NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

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
