/**
 * Authentication helpers for CurbOS public token endpoint
 */

import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { isEmailAllowed } from '@/lib/allowlist';
import { isAdmin as checkUserAdminRole } from '@/lib/admin-utils';
import { logger } from '@/lib/logger';

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
    try {
      const user = await getUserFromRequest(req);
      if (user?.email) {
        const isEmailInAllowlist = isEmailAllowed(user.email);
        const hasAdminRole = checkUserAdminRole(user);
        if (isEmailInAllowlist || hasAdminRole) {
          targetEmail = user.email;
          isAdminBypass = true;
          logger.dev(
            '[API /curbos/public-token/curbos] Admin bypass granted via internal check:',
            { email: targetEmail },
          );
        }
      }
    } catch (adminError) {
      logger.warn(
        '[API /curbos/public-token/curbos] Error checking admin status internally:',
        adminError,
      );
    }
  }

  return { targetEmail, isAdminBypass };
}
