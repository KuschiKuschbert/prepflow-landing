import { isAdmin } from '@/lib/admin-utils';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handle CurbOS specific route protection and tier access checks.
 * Extracted from main middleware to reduce size.
 */
export async function handleCurbOSMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === '/curbos/login';
  const isUnauthorizedPage = pathname === '/curbos/unauthorized';

  // Skip checks for login, unauthorized, and public routes
  if (
    isLoginPage ||
    isUnauthorizedPage ||
    pathname.startsWith('/curbos/public/') ||
    pathname.startsWith('/curbos/order/')
  ) {
    return NextResponse.next();
  }

  try {
    const { hasCurbOSAccess, getCurbOSUserEmail } = await import('@/lib/curbos/tier-access');
    const { getUserFromSession } = await import('@/lib/auth0-middleware');
    const { isEmailAllowed } = await import('@/lib/allowlist');

    // Try to get email from CurbOS cookie first, then fallback to PrepFlow session (for admin bypass)
    let userEmail = await getCurbOSUserEmail(req);
    let emailSource = 'curbos_cookie';
    let user = null;

    if (!userEmail) {
      // No CurbOS email - try PrepFlow session (for admin bypass)
      user = await getUserFromSession(req);
      if (user) {
        userEmail = user.email;
        emailSource = 'prepflow_session';
      }
    }

    if (!userEmail) {
      logger.warn('[CurbOS] No user email found, redirecting to login:', { pathname });
      return NextResponse.redirect(new URL('/curbos/login', req.url));
    }

    // Check if admin first (bypass tier check)
    // Check both ALLOWED_EMAILS and Auth0 admin roles
    const isEmailInAllowlist = isEmailAllowed(userEmail);
    const isUserAdminRole = user ? isAdmin(user) : false;
    const canBypass = isEmailInAllowlist || isUserAdminRole;

    if (canBypass) {
      logger.dev('[CurbOS] Admin access granted (bypass):', {
        email: userEmail,
        source: emailSource,
        hasAdminRole: isUserAdminRole,
        isEmailAllowed: isEmailInAllowlist,
        pathname,
      });
      return NextResponse.next();
    }

    // Not admin - check tier-based access (Business tier required)
    const hasAccess = await hasCurbOSAccess(userEmail, req);
    if (!hasAccess) {
      logger.warn('[CurbOS] Access denied - Business tier required:', {
        userEmail,
        source: emailSource,
        pathname,
      });
      return NextResponse.redirect(new URL('/curbos/unauthorized', req.url));
    }

    // Tier check passed - allow access
    logger.dev('[CurbOS] Access granted:', { userEmail, source: emailSource, pathname });
  } catch (error) {
    logger.error('[CurbOS] Error checking tier access:', {
      error: error instanceof Error ? error.message : String(error),
      pathname,
    });
    return NextResponse.redirect(new URL('/curbos/unauthorized', req.url));
  }

  // Allow access to curbos routes - bypass Auth0 completely
  return NextResponse.next();
}
