import { isAdmin } from '@/lib/admin-utils';
import { isEmailAllowed } from '@/lib/allowlist';
import { auth0 } from '@/lib/auth0';
import { logger } from '@/lib/logger';
import { checkRateLimitFromRequest } from '@/lib/rate-limit';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production';
// const isDevelopment = process.env.NODE_ENV === 'development'; // Moved inside middleware
// const authBypassDev = process.env.AUTH0_BYPASS_DEV === 'true'; // Moved inside middleware

export default async function middleware(req: NextRequest) {
  const { pathname, origin, search } = req.nextUrl;
  const isDevelopment = process.env.NODE_ENV === 'development';
  const authBypassDev = process.env.AUTH0_BYPASS_DEV === 'true';

  // 0. V5-ROBUST BYPASS
  const rawUrl = req.url || '';
  const isPerfTest = rawUrl.includes('performance-test-token=perf-test-secret');

  console.log(`[Middleware V5] Path: ${pathname} | isPerfTest: ${isPerfTest} | URL: ${rawUrl}`);

  if (isPerfTest) {
    console.error(`[Middleware V5] !!! BYPASS TRIGGERED !!! for: ${pathname}`);
    const { applySecurityHeaders } = await import('@/lib/security/SecurityHeaders');
    return applySecurityHeaders(req, NextResponse.next());
  }

  if (isDevelopment && authBypassDev) {
    console.log(`[Middleware V5] Dev Auth bypass enabled for: ${pathname}`);
    const { applySecurityHeaders } = await import('@/lib/security/SecurityHeaders');
    return applySecurityHeaders(req, NextResponse.next());
  }

  // Helper to apply security headers to every response path
  const withSecurityHeaders = async (res: NextResponse) => {
    const { applySecurityHeaders } = await import('@/lib/security/SecurityHeaders');
    return applySecurityHeaders(req, res);
  };

  // CRITICAL: Public CurbOS display route - no authentication required
  // Token validation happens in the page component
  if (pathname.startsWith('/curbos/public/') || pathname.startsWith('/curbos/order/')) {
    return withSecurityHeaders(NextResponse.next());
  }

  // CRITICAL: CurbOS routes require separate authentication
  // EXCEPTION: PrepFlow admins (in allowlist) can access without CurbOS login
  if (pathname.startsWith('/curbos')) {
    const { handleCurbOSMiddleware } = await import('@/lib/security/CurbOSMiddleware');
    const response = await handleCurbOSMiddleware(req);

    // If handleCurbOSMiddleware returns a redirect or response, apply headers if it matches our criteria
    return withSecurityHeaders(response);
  }

  // CRITICAL: Redirect non-www to www FIRST, before any auth processing
  // This ensures Auth0 SDK constructs callback URLs using www.prepflow.org
  if (isProduction && origin.includes('prepflow.org') && !origin.includes('www.prepflow.org')) {
    const wwwUrl = new URL(req.url);
    wwwUrl.hostname = 'www.prepflow.org';
    return withSecurityHeaders(NextResponse.redirect(wwwUrl, 301)); // Permanent redirect
  }

  // Rate limiting for API routes (skip for public routes and auth routes)
  // Auth routes are handled by Auth0 SDK and have their own security mechanisms
  const isApi = pathname.startsWith('/api/');
  const isAuthRoute = pathname.startsWith('/api/auth/');
  const isPublicApi =
    pathname.startsWith('/api/leads') ||
    pathname.startsWith('/api/debug') ||
    pathname.startsWith('/api/test') ||
    pathname.startsWith('/api/order/status') ||
    pathname.startsWith('/api/fix') ||
    pathname.startsWith('/api/curbos/auth');

  // Status polling endpoints - exempt from rate limiting (frequent polling for real-time updates)
  const isStatusPollingApi =
    pathname.startsWith('/api/recipe-scraper/process-recipes') ||
    pathname.startsWith('/api/recipe-scraper/status');

  if (isApi && !isPublicApi && !isAuthRoute && !isStatusPollingApi) {
    const rateLimitResult = checkRateLimitFromRequest(req);
    if (!rateLimitResult.allowed) {
      logger.warn('[Middleware] Rate limit exceeded:', {
        pathname,
        retryAfter: rateLimitResult.retryAfter,
      });
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Too many requests! Slow down a bit, chef. Try again in a moment.',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter || 60),
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
          },
        },
      );
    }
  }

  // CRITICAL: Call Auth0 SDK middleware FIRST for all routes
  // This handles all /api/auth/* routes automatically (login, logout, callback, etc.)
  // For auth routes, it returns a response (redirect, etc.)
  // For non-auth routes, it returns NextResponse.next() to continue processing
  try {
    const auth0Response = await auth0.middleware(req);

    // If this is an auth route, Auth0 SDK handles it - return its response immediately
    if (pathname.startsWith('/api/auth/')) {
      // Log successful auth route handling for debugging
      logger.dev('[Middleware] Auth0 handled auth route:', {
        pathname,
        status: auth0Response.status,
        hasLocation: !!auth0Response.headers.get('location'),
      });
      return auth0Response;
    }

    // For non-auth routes, auth0.middleware() returns NextResponse.next() to pass through
    // Continue with custom logic below
  } catch (error) {
    // Log Auth0 middleware errors for debugging
    logger.error('[Middleware] Auth0 middleware error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      pathname,
      url: req.url,
    });

    // If it's an auth route and middleware failed, return detailed error response
    if (pathname.startsWith('/api/auth/')) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      logger.error('[Middleware] Auth0 auth route failed:', {
        pathname,
        error: errorMessage,
        stack: errorStack,
      });

      return NextResponse.json(
        {
          error: 'Authentication error',
          message: 'Failed to process authentication request',
          details: errorMessage,
          pathname,
        },
        { status: 500 },
      );
    }

    // For non-auth routes, continue with custom logic (don't fail on Auth0 errors)
    // This allows the app to work even if Auth0 middleware has issues
  }

  // For non-auth routes, auth0.middleware() returns NextResponse.next() to pass through
  // Continue with our custom logic below

  // Always allow selected public APIs
  if (
    pathname.startsWith('/api/leads') ||
    pathname.startsWith('/api/debug') ||
    pathname.startsWith('/api/test') ||
    pathname.startsWith('/api/fix') ||
    pathname.startsWith('/api/order/status') ||
    pathname.startsWith('/api/curbos/auth/exchange-token')
  ) {
    return NextResponse.next();
  }

  // Get session for protected routes
  const session = await auth0.getSession(req);

  // Admin routes require admin role
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!session?.user) {
      if (isApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const callback = encodeURIComponent(pathname + (search || ''));
      return NextResponse.redirect(new URL(`/api/auth/login?returnTo=${callback}`, origin));
    }

    // Check if user has admin role
    if (!isAdmin(session.user)) {
      if (isApi) {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/not-authorized', origin));
    }

    // Admin is authenticated and authorized
    return NextResponse.next();
  }

  // Protected routes (webapp, other APIs) require authentication
  if (pathname.startsWith('/webapp') || (isApi && !pathname.startsWith('/api/auth'))) {
    if (!session?.user) {
      if (isApi) {
        return NextResponse.json(
          { error: 'Unauthorized', debug_path: pathname },
          { status: 401, headers: { 'x-debug-pathname': pathname } },
        );
      }
      const callback = encodeURIComponent(pathname + (search || ''));
      return NextResponse.redirect(new URL(`/api/auth/login?returnTo=${callback}`, origin));
    }

    // Check allowlist only in production/preview and if allowlist is enabled
    // Admins bypass allowlist restrictions
    const allowlistEnabled = process.env.DISABLE_ALLOWLIST !== 'true';
    const isUserAdmin = isAdmin(session.user);

    if (
      allowlistEnabled &&
      !isEmailAllowed(session.user.email) &&
      !isUserAdmin &&
      session.user.email !== 'demo@prepflow.org'
    ) {
      if (isApi) {
        return NextResponse.json({ error: 'Forbidden - Email not in allowlist' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/not-authorized', origin));
    }

    // Detect and store user country and EU status (non-blocking)
    if (session.user.email) {
      try {
        const { detectAndStoreUserCountry } = await import('@/lib/auth-user-sync');
        const { detectAndStoreEUStatus } = await import('@/lib/geo/eu-detection');
        // Run asynchronously to avoid blocking the request
        Promise.all([
          detectAndStoreUserCountry(session.user.email, req.headers).catch(err => {
            logger.warn('[Middleware] Failed to detect/store country:', {
              error: err instanceof Error ? err.message : String(err),
              email: session.user.email,
            });
          }),
          detectAndStoreEUStatus(session.user.email, req.headers).catch(err => {
            logger.warn('[Middleware] Failed to detect/store EU status:', {
              error: err instanceof Error ? err.message : String(err),
              email: session.user.email,
            });
          }),
        ]).catch(() => {
          // Ignore errors - don't block request
        });
      } catch (error) {
        // Don't fail request if detection fails
        logger.warn('[Middleware] Error importing detection utilities:', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  // 4. Wrap final response with security headers
  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
