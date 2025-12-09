import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  business_name: string;
}

interface UseProfileFormProps {
  cachedProfile: {
    first_name: string | null;
    last_name: string | null;
    business_name: string | null;
  } | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
    business_name: string | null;
  } | null;
  mountIdRef: React.RefObject<string | null>;
  userHasModifiedRef: React.MutableRefObject<boolean>;
  initialDataLoadedRef: React.MutableRefObject<boolean>;
  USER_MODIFIED_KEY: string;
  onProfileUpdate: (profileData: any) => void;
}

/**
 * Hook for managing profile form state and change tracking
 */
export function useProfileForm({
  cachedProfile,
  profile,
  mountIdRef,
  userHasModifiedRef,
  initialDataLoadedRef,
  USER_MODIFIED_KEY,
  onProfileUpdate,
}: UseProfileFormProps) {
  const initialFormData = useMemo(
    () => ({
      first_name: cachedProfile?.first_name || '',
      last_name: cachedProfile?.last_name || '',
      business_name: cachedProfile?.business_name || '',
    }),
    [],
  );

  const initialFormValuesRef = useRef<ProfileFormData | null>(null);
  if (initialFormValuesRef.current === null) {
    initialFormValuesRef.current = initialFormData;
  }

  const [formData, setFormData] = useState(initialFormData);

  // Track formData changes
  const prevFormDataRef = useRef(formData);
  useEffect(() => {
    if (
      prevFormDataRef.current.first_name !== formData.first_name ||
      prevFormDataRef.current.last_name !== formData.last_name ||
      prevFormDataRef.current.business_name !== formData.business_name
    ) {
      logger.dev('[ProfileInformationPanel] formData changed', {
        mountId: mountIdRef.current,
        previous: prevFormDataRef.current,
        current: formData,
        userHasModified: userHasModifiedRef.current,
      });
      prevFormDataRef.current = formData;
    }
  }, [formData, mountIdRef]);

  // Update formData when profile updates (only if user hasn't modified)
  useEffect(() => {
    if (!profile || initialDataLoadedRef.current) return;

    const userHasModifiedNow =
      userHasModifiedRef.current ||
      (typeof window !== 'undefined' && sessionStorage.getItem(USER_MODIFIED_KEY) === 'true');

    if (!userHasModifiedNow) {
      logger.dev('[ProfileInformationPanel] Updating formData from profile', {
        mountId: mountIdRef.current,
      });
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        business_name: profile.business_name || '',
      });
      initialDataLoadedRef.current = true;
      onProfileUpdate(profile);
    }
  }, [
    profile,
    initialDataLoadedRef,
    userHasModifiedRef,
    USER_MODIFIED_KEY,
    mountIdRef,
    onProfileUpdate,
  ]);

  const handleFieldChange = useCallback(
    (field: keyof ProfileFormData, value: string) => {
      logger.dev(`[ProfileInformationPanel] ${field} onChange`, {
        mountId: mountIdRef.current,
        newValue: value,
        previousValue: formData[field],
      });
      userHasModifiedRef.current = true;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(USER_MODIFIED_KEY, 'true');
      }
      setFormData(prev => {
        const updated = { ...prev, [field]: value };
        logger.dev(`[ProfileInformationPanel] setFormData called for ${field}`, {
          mountId: mountIdRef.current,
          previous: prev[field],
          updated: updated[field],
        });
        return updated;
      });
    },
    [formData, mountIdRef, userHasModifiedRef, USER_MODIFIED_KEY],
  );

  const resetForm = useCallback(() => {
    logger.dev('[ProfileInformationPanel] Resetting formData', {
      mountId: mountIdRef.current,
      currentFormData: formData,
      profileData: {
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        business_name: profile?.business_name || '',
      },
    });
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      business_name: profile?.business_name || '',
    });
    userHasModifiedRef.current = false;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(USER_MODIFIED_KEY);
    }
  }, [formData, profile, mountIdRef, userHasModifiedRef, USER_MODIFIED_KEY]);

  const hasChanges = useMemo(() => {
    return (
      formData.first_name !== (profile?.first_name || '') ||
      formData.last_name !== (profile?.last_name || '') ||
      formData.business_name !== (profile?.business_name || '')
    );
  }, [formData, profile]);

  return {
    formData,
    setFormData,
    handleFieldChange,
    resetForm,
    hasChanges,
  };
}
