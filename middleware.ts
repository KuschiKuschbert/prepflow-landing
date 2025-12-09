import { isEmailAllowed } from '@/lib/allowlist';
import { isAdmin } from '@/lib/admin-utils';
import { getTokenFromCookie, type MiddlewareToken } from '@/lib/middleware-auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const { pathname, origin, search } = req.nextUrl;
  const isProduction = process.env.NODE_ENV === 'production';
  const authConfigured = Boolean(
    process.env.NEXTAUTH_SECRET &&
    process.env.AUTH0_ISSUER_BASE_URL &&
    process.env.AUTH0_CLIENT_ID &&
    process.env.AUTH0_CLIENT_SECRET,
  );

  // Always allow auth and selected public APIs
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/leads')) {
    return NextResponse.next();
  }

  // Admin routes require admin role
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Development bypass: Allow admin access without role check if ADMIN_BYPASS=true
    if (process.env.ADMIN_BYPASS === 'true') {
      if (process.env.NODE_ENV === 'development') {
        // Development-only logging - using console.log for middleware
        // eslint-disable-next-line no-console
        console.log('[Middleware] ADMIN_BYPASS enabled - allowing admin access without role check');
      }
      return NextResponse.next();
    }

    // Skip admin checks in development if auth not configured (for testing)
    if (!isProduction || !authConfigured) {
      return NextResponse.next();
    }

    // Get token using cookie parsing only (avoids openid-client bundling in edge runtime)
    // Note: We never import next-auth/jwt in middleware to prevent openid-client bundling
    const token = await getTokenFromCookie(req, process.env.NEXTAUTH_SECRET);

    const isApi = pathname.startsWith('/api/');

    if (!token) {
      if (isApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      // Only redirect to Auth0 signin if Auth0 is configured
      if (authConfigured) {
        const callback = encodeURIComponent(pathname + (search || ''));
        return NextResponse.redirect(`${origin}/api/auth/signin/auth0?callbackUrl=${callback}`);
      }
      // If Auth0 not configured, redirect to not-authorized page
      return NextResponse.redirect(`${origin}/not-authorized`);
    }

    // Check if user has admin role
    if (!isAdmin(token)) {
      if (isApi) {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
      }
      return NextResponse.redirect(`${origin}/not-authorized`);
    }

    // Admin is authenticated and authorized
    return NextResponse.next();
  }

  // Skip all auth checks in development or if auth is not configured
  if (!isProduction || !authConfigured) {
    return NextResponse.next();
  }

  // Production: Require authentication
  // Get token using cookie parsing only (avoids openid-client bundling in edge runtime)
  // Note: We never import next-auth/jwt in middleware to prevent openid-client bundling
  const token = await getTokenFromCookie(req, process.env.NEXTAUTH_SECRET);

  const isApi = pathname.startsWith('/api/');

  if (!token) {
    if (isApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Only redirect to Auth0 signin if Auth0 is configured
    if (authConfigured) {
      const callback = encodeURIComponent(pathname + (search || ''));
      return NextResponse.redirect(`${origin}/api/auth/signin/auth0?callbackUrl=${callback}`);
    }
    // If Auth0 not configured, redirect to not-authorized page
    return NextResponse.redirect(`${origin}/not-authorized`);
  }

  // Check allowlist only in production and if allowlist is enabled
  // In development, all authenticated users are allowed (early return above handles this)
  // Allowlist can be disabled by setting DISABLE_ALLOWLIST=true for testing/friend access
  const allowlistEnabled = process.env.DISABLE_ALLOWLIST !== 'true';
  const email = (token as any)?.email as string | undefined;
  if (isProduction && allowlistEnabled && !isEmailAllowed(email)) {
    if (isApi) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.redirect(`${origin}/not-authorized`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/webapp/:path*', '/api/:path*', '/admin/:path*'],
};
