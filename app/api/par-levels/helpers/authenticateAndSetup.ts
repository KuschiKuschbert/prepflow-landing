import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

/**
 * Authenticate user and setup Supabase admin client.
 *
 * @returns {Promise<{supabaseAdmin: any, error: NextResponse | null}>} Supabase client and error if any
 */
export async function authenticateAndSetup() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      supabaseAdmin: null,
      error: NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      ),
    };
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = createSupabaseAdmin();
  } catch (supabaseError: any) {
    logger.error('[Par Levels API] Failed to create Supabase admin client:', {
      error: supabaseError instanceof Error ? supabaseError.message : String(supabaseError),
      stack: supabaseError instanceof Error ? supabaseError.stack : undefined,
    });
    return {
      supabaseAdmin: null,
      error: NextResponse.json(
        ApiErrorHandler.createError(
          'Database connection failed. Please check your environment variables.',
          'DATABASE_CONNECTION_ERROR',
          500,
          {
            error: supabaseError instanceof Error ? supabaseError.message : String(supabaseError),
            instructions: [
              'Please ensure SUPABASE_SERVICE_ROLE_KEY is set in your environment variables.',
              'Check your .env.local file or Vercel environment variables.',
            ],
          },
        ),
        { status: 500 },
      ),
    };
  }

  return { supabaseAdmin, error: null };
}
