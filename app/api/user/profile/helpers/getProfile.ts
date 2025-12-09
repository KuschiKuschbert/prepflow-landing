import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { formatProfileResponse } from './formatProfileResponse';

/**
 * Get user profile by email
 */
export async function getProfile(userEmail: string): Promise<NextResponse> {
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

  return NextResponse.json(formatProfileResponse(data, userEmail));
}
