/**
 * Auth0 SDK Route Handler
 * Replaces NextAuth.js [...nextauth]/route.ts
 *
 * This creates the following routes:
 * - GET/POST /api/auth/login - Initiate login
 * - GET/POST /api/auth/logout - Logout
 * - GET /api/auth/callback - OAuth callback
 * - GET /api/auth/me - Get user profile
 *
 * Note: Auth0 SDK v4 uses auth0.middleware() to handle all auth routes.
 * The config in lib/auth0.ts is used for hooks and configuration.
 */

import { auth0 } from '@/lib/auth0';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Auth0 SDK Route Handlers
 * auth0.middleware() handles all auth routes automatically based on lib/auth0.ts config
 * It routes to the appropriate handler (login, logout, callback) based on the pathname
 */
export async function GET(req: NextRequest) {
  try {
    return await auth0.middleware(req);
  } catch (error) {
    logger.error('[Auth0 Route Handler] Error in GET handler:', {
      error: error instanceof Error ? error.message : String(error),
      pathname: req.nextUrl.pathname,
    });
    return NextResponse.json(
      { error: 'Authentication error', message: 'Failed to process authentication request' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    return await auth0.middleware(req);
  } catch (error) {
    logger.error('[Auth0 Route Handler] Error in POST handler:', {
      error: error instanceof Error ? error.message : String(error),
      pathname: req.nextUrl.pathname,
    });
    return NextResponse.json(
      { error: 'Authentication error', message: 'Failed to process authentication request' },
      { status: 500 },
    );
  }
}
