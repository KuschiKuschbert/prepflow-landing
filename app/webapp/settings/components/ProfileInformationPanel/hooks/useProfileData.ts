import { useMemo, useRef } from 'react';
import { getCachedData } from '@/lib/cache/data-cache';
import type { ProfileData } from '../types';
import { useProfileMountTracking } from './useProfileMountTracking';
import { useProfileApiFetch } from './useProfileApiFetch';

/**
 * Hook for managing profile data fetching and caching
 */
export function useProfileData() {
  // Load cached data once on mount
  const cachedProfile = useMemo(() => {
    return typeof window !== 'undefined' ? getCachedData<ProfileData>('user_profile') : null;
  }, []);

  const initialDataLoadedRef = useRef(!!cachedProfile);
  const isLoadingRef = useRef(false);

  const { mountIdRef, userHasModifiedRef, USER_MODIFIED_KEY } = useProfileMountTracking();

  const { profile, setProfile, loading, sessionEmail } = useProfileApiFetch({
    cachedProfile,
    mountIdRef,
    userHasModifiedRef,
    USER_MODIFIED_KEY,
    isLoadingRef,
    initialDataLoadedRef,
  });

  return {
    profile,
    setProfile,
    loading,
    sessionEmail,
    mountIdRef,
    initialDataLoadedRef,
    userHasModifiedRef,
    USER_MODIFIED_KEY,
  };
}
