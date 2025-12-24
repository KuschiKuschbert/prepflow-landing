'use client';

import { logger } from '@/lib/logger';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { initializeProfileState } from './useUserProfile/helpers/initializeProfileState';
import { fetchUserProfile } from './useUserProfile/helpers/fetchUserProfile';

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
  // Handle nested user structure: user.user.email (Auth0 SDK sometimes returns nested structure)
  const userEmail = user?.email || (user as any)?.user?.email;
  const userName = user?.name || (user as any)?.user?.name;

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

  const { initialProfile, initialLoading, validCachedProfile } = initializeProfileState({
    userEmail,
    userName,
  });
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [loading, setLoading] = useState(initialLoading);

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
      userLoading,
      userError: userError?.message,
      hasCachedProfile: !!validCachedProfile,
      currentProfile: profile,
    });

    // Wait for Auth0 useUser() to finish loading before making decisions
    if (userLoading) {
      logger.dev('[useUserProfile] Auth0 useUser() still loading, waiting...');
      return;
    }

    fetchUserProfile({
      userEmail,
      userName: user?.name || null,
      validCachedProfile,
      setProfile,
      setLoading,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail, userLoading]);

  return {
    profile,
    loading,
  };
}
