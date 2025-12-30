import { isAdmin as checkUserAdminRole } from '@/lib/admin-utils';
import { isEmailAllowed } from '@/lib/allowlist';
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/check
 * Check if current user is an admin (email in ALLOWED_EMAILS or has admin role)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user?.email) {
      return NextResponse.json({ isAdmin: false }, { status: 200 });
    }

    const isEmailInAllowlist = isEmailAllowed(user.email);
    const hasAdminRole = checkUserAdminRole(user);
    const isAdmin = isEmailInAllowlist || hasAdminRole;

    logger.dev('[Admin Check API] Status check:', {
      email: user.email,
      isAdmin,
      hasAdminRole,
      isEmailInAllowlist
    });

    return NextResponse.json({
      isAdmin,
      email: user.email,
      hasAdminRole,
      isEmailInAllowlist,
    });
  } catch (error) {
    // Log auth errors for debugging but don't reveal them to client (security)
    logger.error('[Admin Check API] Error checking admin status:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/check', method: 'GET' },
    });
    // Return false for security (don't reveal auth errors to client)
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }
}
