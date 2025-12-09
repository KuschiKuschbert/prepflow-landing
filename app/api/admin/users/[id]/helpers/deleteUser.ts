import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Deletes a user from the database.
 *
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<true | NextResponse>} Success or error response.
 */
export async function deleteUser(userId: string): Promise<true | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { error } = await supabaseAdmin.from('users').delete().eq('id', userId);

  if (error) {
    logger.error('[Admin User API] Database error deleting user:', {
      error: error.message,
      context: { endpoint: `/api/admin/users/${userId}`, method: 'DELETE' },
    });

    return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
  }

  return true;
}
