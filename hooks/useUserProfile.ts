'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchUserProfile } from './useUserProfile/helpers/fetchUserProfile';
import { initializeProfileState } from './useUserProfile/helpers/initializeProfileState';

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

const CACHE_KEY = 'user_profile_data';

/**
 * Hook to fetch user profile from /api/me endpoint with caching via React Query
 * Returns first_name, last_name, display_name, and first_name_display from database
 */
export function useUserProfile(): UseUserProfileReturn {
  const { user, isLoading: userLoading } = useUser();
  const userEmail = user?.email || (user as any)?.user?.email;
  const userName = user?.name || (user as any)?.user?.name;

  // Get initial state (cached in localStorage or derived from session)
  const { initialProfile, validCachedProfile } = useMemo(() =>
    initializeProfileState({ userEmail, userName }),
    [userEmail, userName]
  );

  const { data: profile, isLoading: queryLoading } = useQuery({
    queryKey: [CACHE_KEY, userEmail],
    queryFn: async () => {
      let result: UserProfile | null = null;

      // We need a way to call the fetch logic without it setting state itself
      // I'll create a promise-based version or just use the current one and adapt it
      await fetchUserProfile({
        userEmail,
        userName,
        validCachedProfile,
        setProfile: (p) => { result = p; },
        setLoading: () => {}, // Not needed for useQuery
      });

      return result;
    },
    enabled: !userLoading && !!userEmail,
    initialData: initialProfile,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  return useMemo(
    () => ({
      profile,
      loading: userLoading || (queryLoading && !profile),
    }),
    [profile, userLoading, queryLoading],
  );
}
