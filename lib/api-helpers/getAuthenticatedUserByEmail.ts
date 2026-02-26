/**
 * Get authenticated user ID by email. Shared across API routes.
 */
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function getAuthenticatedUserByEmail(request: NextRequest): Promise<{
  userId: string;
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>;
}> {
  const supabaseAdmin = createSupabaseAdmin();
  const { requireAuth } = await import('@/lib/auth0-api-helpers');
  const authUser = await requireAuth(request);

  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', authUser.email)
    .single();

  if (userError || !userData) {
    if (userError) logger.error('User lookup by email failed', { error: userError });
    throw ApiErrorHandler.createError('User not found', 'NOT_FOUND', 404);
  }
  return { userId: userData.id, supabaseAdmin };
}
