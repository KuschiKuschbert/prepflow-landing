/**
 * Helper for getting user email from Auth0 session
 */

import { logger } from '@/lib/logger';
import { getUserEmail as getEmailFromAuth0 } from '@/lib/auth0-api-helpers';
import { NextRequest } from 'next/server';

/**
 * Gets user email from Auth0 session
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<string | null>} User email or null
 */
export async function getUserEmail(request: NextRequest): Promise<string | null> {
  try {
    return await getEmailFromAuth0(request);
  } catch (tokenError) {
    // Continue without user email if auth fails (for development)
    logger.warn('[Dishes API] Could not get user email for change tracking:', tokenError);
    return null;
  }
}
