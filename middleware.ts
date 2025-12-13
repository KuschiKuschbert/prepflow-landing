import { auth0 } from '@/lib/auth0';
import { isEmailAllowed } from '@/lib/allowlist';
import { isAdmin } from '@/lib/admin-utils';
import { logger } from '@/lib/logger';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const authBypassDev = process.env.AUTH0_BYPASS_DEV === 'true';

export default async function middleware(req: NextRequest) {
  const { pathname, origin, search } = req.nextUrl;

  // CRITICAL: Redirect non-www to www FIRST, before any auth processing
  // This ensures Auth0 SDK constructs callback URLs using www.prepflow.org
  if (isProduction && origin.includes('prepflow.org') && !origin.includes('www.prepflow.org')) {
    const wwwUrl = new URL(req.url);
    wwwUrl.hostname = 'www.prepflow.org';
    return NextResponse.redirect(wwwUrl, 301); // Permanent redirect
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
    pathname.startsWith('/api/fix')
  ) {
    return NextResponse.next();
  }

  // Development bypass: Skip all auth checks if configured
  if (isDevelopment && authBypassDev) {
    logger.dev('[Middleware] Development bypass enabled - skipping authentication');
    return NextResponse.next();
  }

  // Get session for protected routes
  const session = await auth0.getSession(req);
  const isApi = pathname.startsWith('/api/');

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
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const callback = encodeURIComponent(pathname + (search || ''));
      return NextResponse.redirect(new URL(`/api/auth/login?returnTo=${callback}`, origin));
    }

    // Check allowlist only in production/preview and if allowlist is enabled
    const allowlistEnabled = process.env.DISABLE_ALLOWLIST !== 'true';
    if (allowlistEnabled && !isEmailAllowed(session.user.email)) {
      if (isApi) {
        return NextResponse.json({ error: 'Forbidden - Email not in allowlist' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/not-authorized', origin));
    }
  }

  // Allow all other routes (landing page, etc.)
  return NextResponse.next();
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
