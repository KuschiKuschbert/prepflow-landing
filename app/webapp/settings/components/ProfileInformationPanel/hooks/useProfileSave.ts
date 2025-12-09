import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  business_name: string;
}

interface UseProfileSaveProps {
  formData: ProfileFormData;
  setProfile: (profile: any) => void;
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
  setProfile,
  setFormData,
  userHasModifiedRef,
  USER_MODIFIED_KEY,
  mountIdRef,
}: UseProfileSaveProps) {
  const { showSuccess, showError } = useNotification();
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
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
      logger.error('Failed to update profile:', error);
      showError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }, [
    formData,
    setProfile,
    setFormData,
    userHasModifiedRef,
    USER_MODIFIED_KEY,
    mountIdRef,
    showSuccess,
    showError,
  ]);

  return {
    saving,
    handleSave,
  };
}
