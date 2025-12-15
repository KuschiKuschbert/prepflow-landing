import { useState, useMemo, useRef, useCallback } from 'react';
import type { ProfileFormData } from './useProfileForm/types';
import { createHandleFieldChange } from './useProfileForm/helpers/handleFieldChange';
import { createResetForm } from './useProfileForm/helpers/resetForm';
import { checkHasChanges } from './useProfileForm/helpers/hasChanges';
import { useTrackFormDataChanges } from './useProfileForm/helpers/trackFormDataChanges';
import { useUpdateFormFromProfile } from './useProfileForm/helpers/updateFormFromProfile';
import { createInitialFormData } from './useProfileForm/helpers/initialFormData';

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
    () => createInitialFormData(cachedProfile),
    [cachedProfile?.first_name, cachedProfile?.last_name, cachedProfile?.business_name],
  );
  const initialFormValuesRef = useRef<ProfileFormData | null>(null);
  if (initialFormValuesRef.current === null) initialFormValuesRef.current = initialFormData;
  const [formData, setFormData] = useState(initialFormData);
  useTrackFormDataChanges(formData, mountIdRef, userHasModifiedRef);
  useUpdateFormFromProfile(
    profile,
    initialDataLoadedRef,
    userHasModifiedRef,
    USER_MODIFIED_KEY,
    mountIdRef,
    setFormData,
    onProfileUpdate,
  );

  const handleFieldChange = useCallback(
    (field: keyof ProfileFormData, value: string) => {
      const handler = createHandleFieldChange(
        formData,
        mountIdRef,
        userHasModifiedRef,
        USER_MODIFIED_KEY,
        setFormData,
      );
      return handler(field, value);
    },
    [formData, mountIdRef, userHasModifiedRef, USER_MODIFIED_KEY, setFormData],
  );

  const resetForm = useCallback(() => {
    const handler = createResetForm(
      mountIdRef,
      profile,
      formData,
      userHasModifiedRef,
      USER_MODIFIED_KEY,
      setFormData,
    );
    return handler();
  }, [formData, profile, mountIdRef, userHasModifiedRef, USER_MODIFIED_KEY, setFormData]);
  const hasChanges = useMemo(() => checkHasChanges(formData, profile), [formData, profile]);

  return {
    formData,
    setFormData,
    handleFieldChange,
    resetForm,
    hasChanges,
  };
}
