/**
 * Track formData changes.
 */
import { useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';
import type { ProfileFormData } from '../types';

export function useTrackFormDataChanges(
  formData: ProfileFormData,
  mountIdRef: React.RefObject<string | null>,
  userHasModifiedRef: React.MutableRefObject<boolean>,
) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, mountIdRef]); // userHasModifiedRef is a ref and doesn't need to be in deps
}
