import { auth0 } from '@/lib/auth0';
import { logger } from '@/lib/logger';

/**
 * Extract user from Auth0 session
 */
import type { NextRequest } from 'next/server';

interface Auth0SessionUser {
  email?: string | null;
  name?: string | null;
  picture?: string | null;
  sub?: string | null;
  'https://prepflow.org/roles'?: string[];
  email_verified?: boolean;
}

export async function extractUserFromSession(req: NextRequest | { headers: Headers }): Promise<{
  email: string;
  name?: string;
  picture?: string;
  sub: string;
  roles?: string[];
  email_verified?: boolean;
} | null> {
  try {
    // Type assertion: auth0.getSession accepts NextRequest, but we may have a simpler request object
    const session = await auth0.getSession(req as NextRequest);
    if (!session?.user) {
      return null;
    }

    const user = session.user as Auth0SessionUser;
    return {
      email: user.email || '',
      name: user.name || undefined,
      picture: user.picture || undefined,
      sub: user.sub || '',
      roles: user['https://prepflow.org/roles'] || [],
      email_verified: user.email_verified || false,
    };
  } catch (error) {
    logger.error('[Auth0 API Helpers] Failed to get user from request:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
