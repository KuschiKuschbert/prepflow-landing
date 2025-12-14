import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /auth/profile
 * Stub endpoint to prevent 404 errors from Auth0 SDK or other libraries
 * that try to fetch user profile from this default endpoint.
 * Redirects to /api/me which is our actual profile endpoint.
 *
 * @param {NextRequest} req - Request object
 * @returns {Promise<NextResponse>} User profile data or redirect
 */
export async function GET(req: NextRequest) {
  try {
    // Try to get user from request
    const authUser = await getUserFromRequest(req);

    if (!authUser) {
      // Not authenticated - return 401
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Return basic user info (Auth0 SDK expects this format)
    // For full profile data, clients should use /api/me instead
    return NextResponse.json({
      user: {
        email: authUser.email,
        name: authUser.name,
        email_verified: authUser.email_verified || false,
      },
    });
  } catch {
    // If there's an error, return 401 (not authenticated)
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
}
