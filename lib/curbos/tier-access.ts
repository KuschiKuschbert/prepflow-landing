import { isAdmin as checkUserAdminRole } from '@/lib/admin-utils';
import { isEmailAllowed } from '@/lib/allowlist';
import { evaluateGateAsync } from '@/lib/feature-gate';
import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';

/**
 * Check if user has CurbOS access (Business tier required, or admin via allowlist/role)
 */
export async function hasCurbOSAccess(userEmail: string, req?: NextRequest): Promise<boolean> {
  try {
    // 1. Admin access (hardcoded allowlist)
    if (isEmailAllowed(userEmail)) {
      logger.dev('[CurbOS] Access granted via allowlist:', { userEmail });
      return true;
    }

    // 2. Auth0 Admin Role check (if request is provided)
    if (req) {
      try {
        const { auth0 } = await import('@/lib/auth0');
        const session = await auth0.getSession(req as any);
        if (session?.user && checkUserAdminRole(session.user)) {
          logger.dev('[CurbOS] Access granted via Auth0 admin role:', { userEmail: session.user.email });
          return true;
        }
      } catch (authError) {
        // Fallback to tier check if session check fails
      }
    }

    // 3. Check tier-based access (Business tier required)
    const result = await evaluateGateAsync('curbos', req, userEmail);
    return result.allowed;
  } catch (error) {
    logger.error('[CurbOS] Error checking tier access:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return false; // Fail secure
  }
}

/**
 * Get user email from CurbOS Supabase session
 * Extracts email from the curbos_auth cookie or Supabase session
 */
export async function getCurbOSUserEmail(req: NextRequest): Promise<string | null> {
  // Try to get email from cookie (stored during login)
  const userEmailCookie = req.cookies.get('curbos_user_email')?.value;
  if (userEmailCookie) {
    return userEmailCookie;
  }

  // Fallback: Try to get from Supabase session
  // This would require decoding the session token or querying Supabase
  // For now, return null and rely on cookie storage
  return null;
}
