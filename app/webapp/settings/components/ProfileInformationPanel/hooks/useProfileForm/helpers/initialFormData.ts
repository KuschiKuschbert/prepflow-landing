/**
 * Create initial form data from cached profile.
 */
import type { ProfileFormData } from '../types';

export function createInitialFormData(cachedProfile: {
  first_name: string | null;
  last_name: string | null;
  business_name: string | null;
} | null): ProfileFormData {
  return {
    first_name: cachedProfile?.first_name || '',
    last_name: cachedProfile?.last_name || '',
    business_name: cachedProfile?.business_name || '',
  };
}
