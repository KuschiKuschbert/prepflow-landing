import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { formatProfileResponse } from './formatProfileResponse';
import type { ProfileUpdateInput } from './types';

/**
 * Create new user profile
 */
export async function createUser(userEmail: string, updates: ProfileUpdateInput): Promise<NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database not available', 'SERVICE_UNAVAILABLE', 503),
      { status: 503 },
    );
  }

  const { data: newUser, error: createError } = await supabaseAdmin
    .from('users')
    .insert({
      email: userEmail,
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .select('first_name, last_name, business_name, email, created_at, last_login, email_verified')
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
    profile: formatProfileResponse(newUser, userEmail),
  });
}
