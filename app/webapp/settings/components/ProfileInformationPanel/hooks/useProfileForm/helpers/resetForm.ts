/**
 * Reset form logic.
 */
import { logger } from '@/lib/logger';
import type { ProfileFormData } from '../types';

export function createResetForm(
  mountIdRef: React.RefObject<string | null>,
  profile: {
    first_name: string | null;
    last_name: string | null;
    business_name: string | null;
  } | null,
  formData: ProfileFormData,
  userHasModifiedRef: React.MutableRefObject<boolean>,
  USER_MODIFIED_KEY: string,
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>,
) {
  return () => {
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
  };
}
