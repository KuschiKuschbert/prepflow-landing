import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { prefetchApi } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useNotification } from '@/contexts/NotificationContext';
import type { ProfileData } from '../types';
import { loadProfileHelper } from './useProfileApiFetch/helpers/loadProfile';
import { createDefaultProfile } from './useProfileApiFetch/helpers/createDefaultProfile';
import { shouldSkipApiCall } from './useProfileApiFetch/helpers/shouldSkipApiCall';

interface UseProfileApiFetchProps {
  cachedProfile: ProfileData | null;
  mountIdRef: React.RefObject<string | null>;
  userHasModifiedRef: React.MutableRefObject<boolean>;
  USER_MODIFIED_KEY: string;
  isLoadingRef: React.MutableRefObject<boolean>;
  initialDataLoadedRef: React.MutableRefObject<boolean>;
}

/**
 * Hook for fetching profile data from API
 */
export function useProfileApiFetch({
  cachedProfile,
  mountIdRef,
  userHasModifiedRef,
  USER_MODIFIED_KEY,
  isLoadingRef,
  initialDataLoadedRef,
}: UseProfileApiFetchProps) {
  const { showError } = useNotification();
  const { user } = useUser();
  const sessionEmail = user?.email || null;

  const [loading, setLoading] = useState(!cachedProfile);
  const [profile, setProfile] = useState<ProfileData | null>(
    cachedProfile || (sessionEmail ? createDefaultProfile(sessionEmail) : null),
  );

  useEffect(() => {
    if (sessionEmail && !profile?.email) {
      logger.dev('[ProfileInformationPanel] Setting profile from session email', {
        mountId: mountIdRef.current,
        sessionEmail,
      });
      setProfile(createDefaultProfile(sessionEmail));
    }
  }, [sessionEmail, profile?.email, mountIdRef]);

  useEffect(() => {
    const currentMountId = mountIdRef.current;
    const skipResult = shouldSkipApiCall(
      userHasModifiedRef,
      USER_MODIFIED_KEY,
      isLoadingRef,
      cachedProfile,
      initialDataLoadedRef,
      setLoading,
    );
    if (skipResult.skip) {
      logger.dev(`[ProfileInformationPanel] Skipping API call - ${skipResult.reason}`, {
        mountId: currentMountId,
      });
      return;
    }
    prefetchApi('/api/user/profile');
    loadProfileHelper(
      sessionEmail,
      setProfile,
      setLoading,
      isLoadingRef,
      showError,
      currentMountId,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Effect should only run once on mount; refs and constants don't need to be in deps

  return {
    profile,
    setProfile,
    loading,
    sessionEmail,
  };
}
