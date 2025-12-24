import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { ProfileData } from '../types';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  business_name: string;
}

interface UseProfileSaveProps {
  formData: ProfileFormData;
  profile: ProfileData | null;
  setProfile: (profile: ProfileData | null) => void;
  setFormData: (data: ProfileFormData) => void;
  userHasModifiedRef: React.MutableRefObject<boolean>;
  USER_MODIFIED_KEY: string;
  mountIdRef: React.RefObject<string | null>;
}

/**
 * Hook for handling profile save operations
 */
export function useProfileSave({
  formData,
  profile,
  setProfile,
  setFormData,
  userHasModifiedRef,
  USER_MODIFIED_KEY,
  mountIdRef,
}: UseProfileSaveProps) {
  const { showSuccess, showError } = useNotification();

  const handleSave = useCallback(async () => {
    // Store original profile for rollback
    const originalProfile = profile ? { ...profile } : null;

    try {
      // Optimistically update profile immediately from formData
      const optimisticProfile: ProfileData = {
        ...profile,
        first_name: formData.first_name,
        last_name: formData.last_name,
        business_name: formData.business_name,
      } as ProfileData;
      setProfile(optimisticProfile);
      setFormData({
        first_name: formData.first_name,
        last_name: formData.last_name,
        business_name: formData.business_name,
      });

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to update profile');
      }

      if (data.profile) {
        // Replace optimistic update with server response
        setProfile(data.profile);
        logger.dev('[ProfileInformationPanel] Updating formData after successful save', {
          mountId: mountIdRef.current,
          savedProfile: data.profile,
        });
        setFormData({
          first_name: data.profile.first_name || '',
          last_name: data.profile.last_name || '',
          business_name: data.profile.business_name || '',
        });
        userHasModifiedRef.current = false;
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(USER_MODIFIED_KEY);
        }
        cacheData('user_profile', data.profile, 5 * 60 * 1000);
      }

      showSuccess('Profile updated successfully');
    } catch (error) {
      // Rollback on error - restore original profile
      if (originalProfile) {
        setProfile(originalProfile);
        setFormData({
          first_name: originalProfile.first_name || '',
          last_name: originalProfile.last_name || '',
          business_name: originalProfile.business_name || '',
        });
      }
      logger.error('Failed to update profile:', error);
      showError(error instanceof Error ? error.message : 'Failed to update profile');
    }
  }, [
    formData,
    profile,
    setProfile,
    setFormData,
    userHasModifiedRef,
    USER_MODIFIED_KEY,
    mountIdRef,
    showSuccess,
    showError,
  ]);

  return {
    handleSave,
  };
}
