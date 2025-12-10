/**
 * Helper for getting user email from token
 */

import { logger } from '@/lib/logger';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

/**
 * Gets user email from NextAuth token
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<string | null>} User email or null
 */
export async function getUserEmail(request: NextRequest): Promise<string | null> {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    return (token?.email as string) || null;
  } catch (tokenError) {
    // Continue without user email if auth fails (for development)
    logger.warn('[Dishes API] Could not get user email for change tracking:', tokenError);
    return null;
  }
}



