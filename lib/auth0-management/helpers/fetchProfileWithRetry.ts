import { logger } from '@/lib/logger';
import { getUserProfileFromManagementAPI } from './getUserProfile';

/**
 * Fetch user profile with timeout and retry logic
 */
export async function fetchProfileWithRetry(
  auth0UserId: string,
  fallbackEmail?: string,
): Promise<string | undefined> {
  const timeout = 5000;
  const maxRetries = 1;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const profilePromise = getUserProfileFromManagementAPI(auth0UserId);
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Management API timeout')), timeout),
      );

      const profile = await Promise.race([profilePromise, timeoutPromise]);
      if (profile?.email) {
        logger.dev(`[Auth0 Management] Profile fetched successfully (attempt ${attempt + 1})`);
        return profile.email;
      }
      if (profile && !profile.email) {
        logger.warn(`[Auth0 Management] Profile found but email missing for ${auth0UserId}`);
        return fallbackEmail;
      }
    } catch (error) {
      if (attempt === maxRetries) {
        logger.warn(
          `[Auth0 Management] Failed after ${maxRetries + 1} attempts for ${auth0UserId}:`,
          error instanceof Error ? error.message : String(error),
        );
        return fallbackEmail;
      }
      logger.dev(`[Auth0 Management] Retry attempt ${attempt + 1}/${maxRetries} for ${auth0UserId}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return fallbackEmail;
}
