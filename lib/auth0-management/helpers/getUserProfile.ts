import { logger } from '@/lib/logger';
import { getManagementClient } from '../../auth0-management';

interface Auth0UserProfile {
  sub?: string;
  user_id?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  nickname?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

/**
 * Get user profile from Auth0 Management API
 */
export async function getUserProfileFromManagementAPI(
  auth0UserId: string,
): Promise<Auth0UserProfile | null> {
  const client = getManagementClient();

  if (!client) {
    return null;
  }
  try {
    const userResponse = await client.users.get({ id: auth0UserId });
    const user =
      (userResponse as { data: Auth0UserProfile }).data || (userResponse as Auth0UserProfile); // Handle potential Axios wrap
    if (!user) {
      return null;
    }
    return {
      sub: user.user_id || auth0UserId,
      email: user.email,
      email_verified: user.email_verified || false,
      name: user.name,
      nickname: user.nickname,
      picture: user.picture,
      given_name: user.given_name,
      family_name: user.family_name,
    };
  } catch (error) {
    logger.error(`[Auth0 Management] Failed to fetch user profile for ${auth0UserId}:`, error);
    return null;
  }
}
