import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getStandardTaskTemplates } from '@/lib/cleaning/standard-tasks';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

async function getAuthenticatedUser(request: NextRequest) {
  const supabaseAdmin = createSupabaseAdmin();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(
    request.headers.get('Authorization')?.replace('Bearer ', '') || '',
  );

  // Fallback/Use Auth0 helper
  const { requireAuth } = await import('@/lib/auth0-api-helpers');
  const authUser = await requireAuth(request);

  // Get user_id from email
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', authUser.email)
    .single();

  if (userError || !userData) {
    throw ApiErrorHandler.createError('User not found', 'NOT_FOUND', 404);
  }
  return { userId: userData.id, supabase: supabaseAdmin };
}

/**
 * GET /api/cleaning-tasks/standard-templates
 * Get list of standard task templates
 *
 * @returns {Promise<NextResponse>} List of standard task templates
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await getAuthenticatedUser(request);
    if (!userId) {
      throw ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401);
    }

    const templates = getStandardTaskTemplates();

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (err: unknown) {
    if (err instanceof NextResponse) return err;

    logger.error('[Cleaning Tasks API] Error fetching standard templates:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/cleaning-tasks/standard-templates', method: 'GET' },
    });

    if (err && typeof err === 'object' && 'status' in err) {
      const errorStatus = (err as { status: number }).status;
      return NextResponse.json(err, { status: errorStatus || 500 });
    }

    return NextResponse.json(
      ApiErrorHandler.createError(
        err instanceof Error ? err.message : 'Failed to fetch standard task templates',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
