import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/debug/user-data
 * Debug endpoint to check user data in database and Auth0 session
 * Shows exactly what data is available at each step
 */
export async function GET(req: NextRequest) {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json(
        ApiErrorHandler.createError('Not authenticated', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    // Get database user data
    let dbUser: any = null;
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select(
          'id, email, first_name, last_name, email_verified, last_login, created_at, updated_at',
        )
        .eq('email', authUser.email)
        .maybeSingle();

      if (error) {
        logger.error('[Debug User Data] Database error:', error);
      } else {
        dbUser = data;
      }
    }

    const debugData = {
      auth0Session: {
        email: authUser.email,
        name: authUser.name,
        email_verified: authUser.email_verified,
        sub: authUser.sub,
      },
      databaseUser: dbUser,
      computed: {
        first_name: dbUser?.first_name || null,
        last_name: dbUser?.last_name || null,
        hasFirstName: !!dbUser?.first_name,
        hasLastName: !!dbUser?.last_name,
        hasBothNames: !!(dbUser?.first_name && dbUser?.last_name),
      },
    };

    logger.dev('[Debug User Data] Complete user data:', debugData);

    return NextResponse.json(debugData);
  } catch (error) {
    logger.error('[Debug User Data] Error:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
