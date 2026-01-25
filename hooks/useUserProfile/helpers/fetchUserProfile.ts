import { cacheData, prefetchApi } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { buildFallbackProfile } from './buildFallbackProfile';
import { buildProfileData } from './buildProfileData';

const CACHE_KEY = 'user_profile_me';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  first_name_display: string | null;
  email: string;
  name?: string | null;
}

interface FetchUserProfileParams {
  userEmail?: string | null;
  userName?: string | null;
  validCachedProfile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Fetch user profile from /api/me endpoint
 */
export async function fetchUserProfile({
  userEmail,
  userName,
  validCachedProfile,
  setProfile,
  setLoading,
}: FetchUserProfileParams): Promise<void> {
  // logger.dev('[useUserProfile] Starting loadProfile (will try /api/me even without userEmail)');
  if (!validCachedProfile) {
    setLoading(true);
  }

  try {
    prefetchApi('/api/me');
    const response = await fetch('/api/me');

    if (response.status === 401) {
      logger.dev('[useUserProfile] User not authenticated (401), setting profile to null');
      setProfile(null);
      setLoading(false);
      return;
    }

    if (!response.ok) {
      logger.dev('[useUserProfile] Failed to fetch profile, using session data', {
        status: response.status,
      });
      setProfile(buildFallbackProfile(userEmail, userName));
      setLoading(false);
      return;
    }

    const data = await response.json();
    const userData = data.user;

    if (userData) {
      const profileData = buildProfileData({ userData, userEmail, userName });
      if (!profileData.email) {
        logger.error('[useUserProfile] Invalid profileData - missing email:', profileData);
        setProfile(buildFallbackProfile(userEmail, userName));
        setLoading(false);
        return;
      }
      setProfile(profileData);
      cacheData(CACHE_KEY, profileData, CACHE_EXPIRY_MS);
    } else {
      // logger.dev('[useUserProfile] No userData in API response');
      setProfile(buildFallbackProfile(userEmail, userName));
    }
  } catch (error) {
    logger.dev('[useUserProfile] Network error, using session data:', {
      error: error instanceof Error ? error.message : String(error),
    });
    setProfile(buildFallbackProfile(userEmail, userName));
  } finally {
    setLoading(false);
  }
}
