import { getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';

const CACHE_KEY = 'user_profile_me';

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  first_name_display: string | null;
  email: string;
  name?: string | null;
}

interface InitializeProfileStateParams {
  userEmail?: string | null;
  userName?: string | null;
}

/**
 * Initialize profile state with cached data or session data
 */
export function initializeProfileState({
  userEmail,
  userName,
}: InitializeProfileStateParams): {
  initialProfile: UserProfile | null;
  initialLoading: boolean;
  validCachedProfile: UserProfile | null;
} {
  const cachedProfile =
    typeof window !== 'undefined' ? getCachedData<UserProfile>(CACHE_KEY) : null;
  const validCachedProfile =
    cachedProfile && typeof cachedProfile === 'object' && 'email' in cachedProfile
      ? cachedProfile
      : null;

  logger.dev('[useUserProfile] Hook initialized:', {
    hasUserEmail: !!userEmail,
    userEmail,
    hasCachedProfile: !!cachedProfile,
    cachedProfileData: cachedProfile,
    isValidCachedProfile: !!validCachedProfile,
    validCachedProfileData: validCachedProfile,
  });

  const initialProfile: UserProfile | null =
    validCachedProfile ||
    (userEmail
      ? {
          email: userEmail,
          first_name: null,
          last_name: null,
          display_name: null,
          first_name_display: null,
          name: userName || null,
        }
      : null);

  const initialLoading = !validCachedProfile;

  logger.dev('[useUserProfile] Initial state set:', {
    profile: initialProfile,
    loading: initialLoading,
  });

  return {
    initialProfile,
    initialLoading,
    validCachedProfile,
  };
}
