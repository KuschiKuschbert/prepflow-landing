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
  const { user } = useUser();
  const userEmail = user?.email;

  // Initialize with cached data for instant display
  const cachedProfile =
    typeof window !== 'undefined' ? getCachedData<UserProfile>(CACHE_KEY) : null;
  const [profile, setProfile] = useState<UserProfile | null>(
    cachedProfile ||
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
  const [loading, setLoading] = useState(!cachedProfile);

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
  useEffect(() => {
    if (!userEmail) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Use cached data if available
    if (cachedProfile) {
      setProfile(cachedProfile);
      setLoading(false);
      return;
    }

    // Prefetch for faster loading
    prefetchApi('/api/me');

    const loadProfile = async () => {
      setLoading(true);

      try {
        const response = await fetch('/api/me');

        if (response.status === 401) {
          // Not authenticated, use session data only
          logger.dev('[useUserProfile] User not authenticated (401), using session data');
          setProfile({
            email: userEmail,
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
            email: userEmail,
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
        const userData = data.user;

        if (userData) {
          const profileData: UserProfile = {
            email: userData.email || userEmail,
            first_name: userData.first_name || null,
            last_name: userData.last_name || null,
            display_name: userData.display_name || null,
            first_name_display: userData.first_name_display || null,
            name: userData.name || user?.name || null,
          };

          setProfile(profileData);
          // Cache for next render
          cacheData(CACHE_KEY, profileData, CACHE_EXPIRY_MS);
        }
      } catch (error) {
        // Network error, use session data as fallback
        logger.dev('[useUserProfile] Network error, using session data:', {
          error: error instanceof Error ? error.message : String(error),
        });
        setProfile({
          email: userEmail,
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
