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
import { NextRequest } from 'next/server';

/**
 * Auth0 SDK Route Handlers
 * auth0.middleware() handles all auth routes automatically based on lib/auth0.ts config
 */
export async function GET(req: NextRequest) {
  return auth0.middleware(req);
}

export async function POST(req: NextRequest) {
  return auth0.middleware(req);
}
