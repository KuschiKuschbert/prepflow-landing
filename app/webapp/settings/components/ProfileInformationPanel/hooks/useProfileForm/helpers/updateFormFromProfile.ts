/**
 * Update formData from profile when profile updates.
 */
import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export function useUpdateFormFromProfile(
  profile: {
    first_name: string | null;
    last_name: string | null;
    business_name: string | null;
  } | null,
  initialDataLoadedRef: React.MutableRefObject<boolean>,
  userHasModifiedRef: React.MutableRefObject<boolean>,
  USER_MODIFIED_KEY: string,
  mountIdRef: React.RefObject<string | null>,
  setFormData: React.Dispatch<
    React.SetStateAction<{ first_name: string; last_name: string; business_name: string }>
  >,
  onProfileUpdate: (profileData: any) => void,
) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    profile,
    initialDataLoadedRef,
    userHasModifiedRef,
    USER_MODIFIED_KEY,
    mountIdRef,
    onProfileUpdate,
    // setFormData is stable from useState and doesn't need to be in deps
  ]);
}
