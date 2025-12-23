import { auth0 } from '@/lib/auth0';
import { logger } from '@/lib/logger';

/**
 * Extract user from Auth0 session
 */
export async function extractUserFromSession(req: { headers: Headers }): Promise<{
  email: string;
  name?: string;
  picture?: string;
  sub: string;
  roles?: string[];
  email_verified?: boolean;
} | null> {
  try {
    const session = await auth0.getSession(req);
    if (!session?.user) {
      return null;
    }

    return {
      email: session.user.email || '',
      name: session.user.name,
      picture: session.user.picture,
      sub: session.user.sub || '',
      roles: (session.user as any)['https://prepflow.org/roles'] || [],
      email_verified: (session.user as any).email_verified || false,
    };
  } catch (error) {
    logger.error('[Auth0 API Helpers] Failed to get user from request:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

