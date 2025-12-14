import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getUserDisplayName, getUserFirstName } from '@/lib/user-name';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    // Fetch user data from database
    let dbUser: {
      first_name: string | null;
      last_name: string | null;
    } | null = null;

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('first_name, last_name')
        .eq('email', authUser.email)
        .maybeSingle();

      if (!error && data) {
        dbUser = data;
      }
    }

    // Combine Auth0 session data with database data
    const user = {
      ...authUser,
      first_name: dbUser?.first_name || null,
      last_name: dbUser?.last_name || null,
      // Computed fields for convenience
      display_name: getUserDisplayName({
        first_name: dbUser?.first_name,
        last_name: dbUser?.last_name,
        name: authUser.name,
        email: authUser.email,
      }),
      first_name_display: getUserFirstName({
        first_name: dbUser?.first_name,
        name: authUser.name,
        email: authUser.email,
      }),
    };

    return NextResponse.json({ user });
  } catch (error) {
    logger.error('[API /me] Failed to get user session:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/me', method: 'GET' },
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
