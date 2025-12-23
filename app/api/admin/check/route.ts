import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { isEmailAllowed } from '@/lib/allowlist';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * GET /api/admin/check
 * Check if current user is an admin (email in ALLOWED_EMAILS)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user?.email) {
      return NextResponse.json({ isAdmin: false }, { status: 200 });
    }

    const isAdmin = isEmailAllowed(user.email);

    return NextResponse.json({
      isAdmin,
      email: user.email,
    });
  } catch (error) {
    // Log auth errors for debugging but don't reveal them to client (security)
    logger.dev('[Admin Check API] Error checking admin status:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }
}
