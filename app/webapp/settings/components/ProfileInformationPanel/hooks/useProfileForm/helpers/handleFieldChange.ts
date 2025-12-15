/**
 * Handle field change logic.
 */
import { logger } from '@/lib/logger';
import type { ProfileFormData } from '../types';

export function createHandleFieldChange(
  formData: ProfileFormData,
  mountIdRef: React.RefObject<string | null>,
  userHasModifiedRef: React.MutableRefObject<boolean>,
  USER_MODIFIED_KEY: string,
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>,
) {
  return (field: keyof ProfileFormData, value: string) => {
    logger.dev(`[ProfileInformationPanel] ${field} onChange`, { mountId: mountIdRef.current, newValue: value, previousValue: formData[field] });
    userHasModifiedRef.current = true;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(USER_MODIFIED_KEY, 'true');
    }
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      logger.dev(`[ProfileInformationPanel] setFormData called for ${field}`, { mountId: mountIdRef.current, previous: prev[field], updated: updated[field] });
      return updated;
    });
  };
}
