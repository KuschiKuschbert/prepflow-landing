/**
 * Authentication helpers for CurbOS public token endpoint
 */

import { isAdmin as checkUserAdminRole } from '@/lib/admin-utils';
import { isEmailAllowed } from '@/lib/allowlist';
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';

interface AuthResult {
  targetEmail: string | null;
  isAdminBypass: boolean;
}

/**
 * Get target email from CurbOS cookie or PrepFlow admin
 */
export async function getTargetEmail(req: NextRequest): Promise<AuthResult> {
  const userEmailCookie = req.cookies.get('curbos_user_email')?.value;
  let targetEmail = userEmailCookie || null;
  let isAdminBypass = false;

  if (!targetEmail) {
    const internalEmail = await checkInternalAdminAccess(req);
    if (internalEmail) {
      targetEmail = internalEmail;
      isAdminBypass = true;
    }
  }

  return { targetEmail, isAdminBypass };
}

async function checkInternalAdminAccess(req: NextRequest): Promise<string | null> {
  try {
    const user = await getUserFromRequest(req);
    if (user?.email) {
      const isEmailInAllowlist = isEmailAllowed(user.email);
      const hasAdminRole = checkUserAdminRole(user);
      if (isEmailInAllowlist || hasAdminRole) {
        logger.dev('[API /curbos/public-token/curbos] Admin bypass granted via internal check:', {
          email: user.email,
        });
        return user.email;
      }
    }
    return null;
  } catch (adminError) {
    logger.warn(
      '[API /curbos/public-token/curbos] Error checking admin status internally:',
      adminError,
    );
    return null;
  }

}
