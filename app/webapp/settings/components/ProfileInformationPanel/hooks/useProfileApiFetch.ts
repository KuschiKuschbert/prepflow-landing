import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { cacheData, getCachedData, prefetchApi } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useNotification } from '@/contexts/NotificationContext';
import type { ProfileData } from '../types';

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
    cachedProfile ||
      (sessionEmail
        ? {
            email: sessionEmail,
            first_name: null,
            last_name: null,
            business_name: null,
            created_at: null,
            last_login: null,
            email_verified: false,
          }
        : null),
  );

  // Update profile with session email if session becomes available
  useEffect(() => {
    if (sessionEmail && !profile?.email) {
      logger.dev('[ProfileInformationPanel] Setting profile from session email', {
        mountId: mountIdRef.current,
        sessionEmail,
      });
      setProfile({
        email: sessionEmail,
        first_name: null,
        last_name: null,
        business_name: null,
        created_at: null,
        last_login: null,
        email_verified: false,
      });
    }
  }, [sessionEmail, profile?.email, mountIdRef]);

  // Load profile data on mount
  useEffect(() => {
    const currentMountId = mountIdRef.current;

    const userHasModified =
      userHasModifiedRef.current ||
      (typeof window !== 'undefined' && sessionStorage.getItem(USER_MODIFIED_KEY) === 'true');

    if (userHasModified) {
      logger.dev('[ProfileInformationPanel] Skipping API call - user has modified form', {
        mountId: currentMountId,
      });
      return;
    }

    if (isLoadingRef.current) {
      logger.dev('[ProfileInformationPanel] Skipping API call - already loading', {
        mountId: currentMountId,
      });
      return;
    }

    if (cachedProfile) {
      logger.dev('[ProfileInformationPanel] Using cached profile, skipping API call', {
        mountId: currentMountId,
      });
      initialDataLoadedRef.current = true;
      setLoading(false);
      return;
    }

    prefetchApi('/api/user/profile');

    const loadProfile = async () => {
      isLoadingRef.current = true;

      logger.dev('[ProfileInformationPanel] Starting API call', {
        mountId: currentMountId,
      });

      try {
        const response = await fetch('/api/user/profile');

        if (response.status === 401) {
          logger.dev(
            '[ProfileInformationPanel] User not authenticated (401), using session email',
            {
              mountId: currentMountId,
              sessionEmail,
            },
          );
          if (sessionEmail && !profile) {
            setProfile({
              email: sessionEmail,
              first_name: null,
              last_name: null,
              business_name: null,
              created_at: null,
              last_login: null,
              email_verified: false,
            });
          }
          setLoading(false);
          isLoadingRef.current = false;
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || errorData.message || 'Failed to load profile';
          logger.error('[ProfileInformationPanel] API error:', {
            status: response.status,
            error: errorMessage,
            mountId: currentMountId,
          });
          showError(`Failed to load profile: ${errorMessage}`);
          setLoading(false);
          isLoadingRef.current = false;
          return;
        }

        const data = await response.json();
        const profileData = data.profile || data;
        if (profileData) {
          setProfile(profileData);
          cacheData('user_profile', profileData, 5 * 60 * 1000);
        }
      } catch (error) {
        logger.error('[ProfileInformationPanel] Network or unexpected error:', {
          error: error instanceof Error ? error.message : String(error),
          mountId: currentMountId,
        });
        showError('Failed to load profile information. Please check your connection.');
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    profile,
    setProfile,
    loading,
    sessionEmail,
  };
}
