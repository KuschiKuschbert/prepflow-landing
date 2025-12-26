import { evaluateGateAsync } from '@/lib/feature-gate';
import { isEmailAllowed } from '@/lib/allowlist';
import { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Check if user has CurbOS access (Business tier required, or admin via allowlist)
 */
export async function hasCurbOSAccess(userEmail: string, req?: NextRequest): Promise<boolean> {
  try {
    // Admin access (allowlist) - automatic access regardless of tier
    if (isEmailAllowed(userEmail)) {
      logger.dev('[CurbOS] Admin access granted via allowlist:', { userEmail });
      return true;
    }

    // Check tier-based access (Business tier required)
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
