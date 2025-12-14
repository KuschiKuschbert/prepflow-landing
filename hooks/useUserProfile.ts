'use client';

import { cacheData, getCachedData, prefetchApi } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';

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

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
}

/**
 * Hook to fetch user profile from /api/me endpoint with caching
 * Returns first_name, last_name, display_name, and first_name_display from database
 *
 * @returns {UseUserProfileReturn} User profile hook
 * @returns {UserProfile | null} returns.profile - User profile data or null
 * @returns {boolean} returns.loading - Loading state
 *
 * @example
 * ```typescript
 * const { profile, loading } = useUserProfile();
 * const displayName = profile?.display_name || 'User';
 * ```
 */
export function useUserProfile(): UseUserProfileReturn {
  const { user, error: userError, isLoading: userLoading } = useUser();
  const userEmail = user?.email;

  // Log Auth0 useUser() result to debug why userEmail is missing
  useEffect(() => {
    logger.dev('[useUserProfile] Auth0 useUser() result:', {
      hasUser: !!user,
      user,
      userEmail,
      userError: userError?.message,
      userLoading,
      userKeys: user ? Object.keys(user) : [],
      userEmailValue: user?.email,
      userNameValue: user?.name,
    });
  }, [user, userEmail, userError, userLoading]);

  // Initialize with cached data for instant display
  const cachedProfile =
    typeof window !== 'undefined' ? getCachedData<UserProfile>(CACHE_KEY) : null;

  // Validate cached profile - must have email property to be valid
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

  const [profile, setProfile] = useState<UserProfile | null>(
    validCachedProfile ||
      (userEmail
        ? {
            email: userEmail,
            first_name: null,
            last_name: null,
            display_name: null,
            first_name_display: null,
            name: user?.name || null,
          }
        : null),
  );
  // Use same validation variable as fetch effect to prevent unnecessary state updates
  const [loading, setLoading] = useState(!validCachedProfile);

  logger.dev('[useUserProfile] Initial state set:', {
    profile,
    loading,
  });

  // Update profile with session email if session becomes available
  useEffect(() => {
    if (userEmail && !profile?.email) {
      setProfile({
        email: userEmail,
        first_name: null,
        last_name: null,
        display_name: null,
        first_name_display: null,
        name: user?.name || null,
      });
    }
  }, [userEmail, profile?.email, user?.name]);

  // Fetch profile from /api/me on mount
  // Always fetch fresh data to ensure UI updates when name becomes available
  // Cached data is already used for initial state above (prevents loading flash)
  useEffect(() => {
    logger.dev('[useUserProfile] useEffect triggered:', {
      hasUserEmail: !!userEmail,
      userEmail,
      hasCachedProfile: !!cachedProfile,
      currentProfile: profile,
    });

    if (!userEmail) {
      logger.dev('[useUserProfile] No userEmail, setting profile to null');
      setProfile(null);
      setLoading(false);
      return;
    }

    // Prefetch for faster loading
    prefetchApi('/api/me');

    const loadProfile = async () => {
      logger.dev('[useUserProfile] Starting loadProfile');
      // Only show loading if we don't have valid cached data (better UX)
      if (!validCachedProfile) {
        setLoading(true);
      }

      try {
        const response = await fetch('/api/me');

        if (response.status === 401) {
          // Not authenticated, use session data only
          logger.dev('[useUserProfile] User not authenticated (401), using session data');
          setProfile({
            email: userEmail || '',
            first_name: null,
            last_name: null,
            display_name: null,
            first_name_display: null,
            name: user?.name || null,
          });
          setLoading(false);
          return;
        }

        if (!response.ok) {
          // Error fetching, use session data as fallback
          logger.dev('[useUserProfile] Failed to fetch profile, using session data', {
            status: response.status,
          });
          setProfile({
            email: userEmail || '',
            first_name: null,
            last_name: null,
            display_name: null,
            first_name_display: null,
            name: user?.name || null,
          });
          setLoading(false);
          return;
        }

        const data = await response.json();
        logger.dev('[useUserProfile] Raw API response:', {
          data,
          dataKeys: Object.keys(data || {}),
          hasUser: !!data.user,
          userType: typeof data.user,
        });

        const userData = data.user;
        logger.dev('[useUserProfile] Extracted userData:', {
          userData,
          userDataKeys: userData ? Object.keys(userData) : [],
          userDataType: typeof userData,
          hasUserData: !!userData,
          userDataFirst: userData?.first_name,
          userDataLast: userData?.last_name,
          userDataDisplay: userData?.display_name,
          userDataEmail: userData?.email,
        });

        if (userData) {
          const profileData: UserProfile = {
            email: userData.email || userEmail || '',
            first_name: userData.first_name || null,
            last_name: userData.last_name || null,
            display_name: userData.display_name || null,
            first_name_display: userData.first_name_display || null,
            name: userData.name || user?.name || null,
          };

          // Validate profileData has at least email
          if (!profileData.email) {
            logger.error('[useUserProfile] Invalid profileData - missing email:', profileData);
            // Fallback to session data
            setProfile({
              email: userEmail || '',
              first_name: null,
              last_name: null,
              display_name: null,
              first_name_display: null,
              name: user?.name || null,
            });
            setLoading(false);
            return;
          }

          logger.dev('[useUserProfile] Received API data:', {
            first_name: userData.first_name,
            last_name: userData.last_name,
            display_name: userData.display_name,
            first_name_display: userData.first_name_display,
            email: profileData.email,
          });

          logger.dev('[useUserProfile] About to set profile state:', {
            profileData,
            profileDataKeys: Object.keys(profileData),
            profileDataStringified: JSON.stringify(profileData),
          });

          setProfile(profileData);

          // Log after state update (will show in next render)
          logger.dev('[useUserProfile] Profile state set (check next render):', {
            profileData,
            email: profileData.email,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
          });

          // Cache fresh data for next render
          // This ensures UI updates immediately and cache is fresh for next mount
          cacheData(CACHE_KEY, profileData, CACHE_EXPIRY_MS);
        } else {
          logger.dev('[useUserProfile] No userData in API response');
          // Set fallback profile with email
          setProfile({
            email: userEmail || '',
            first_name: null,
            last_name: null,
            display_name: null,
            first_name_display: null,
            name: user?.name || null,
          });
        }
      } catch (error) {
        // Network error, use session data as fallback
        logger.dev('[useUserProfile] Network error, using session data:', {
          error: error instanceof Error ? error.message : String(error),
        });
        // Ensure email has fallback to prevent invalid profile objects
        setProfile({
          email: userEmail || '',
          first_name: null,
          last_name: null,
          display_name: null,
          first_name_display: null,
          name: user?.name || null,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  return {
    profile,
    loading,
  };
}
