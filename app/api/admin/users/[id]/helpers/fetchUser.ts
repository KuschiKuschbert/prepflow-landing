import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Fetches a user by ID from the database.
 *
 * @param {string} userId - The ID of the user to fetch.
 * @returns {Promise<{ user: any } | NextResponse>} User data or error response.
 */
export async function fetchUser(userId: string): Promise<{ user: any } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json(ApiErrorHandler.createError('User not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    logger.error('[Admin User API] Database error:', {
      error: error.message,
      context: { endpoint: `/api/admin/users/${userId}`, method: 'GET' },
    });

    return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
  }

  return { user };
}
