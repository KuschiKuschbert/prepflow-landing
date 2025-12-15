/**
 * Check if form has changes.
 */
import type { ProfileFormData } from '../types';

export function checkHasChanges(
  formData: ProfileFormData,
  profile: { first_name: string | null; last_name: string | null; business_name: string | null } | null,
): boolean {
  return (
    formData.first_name !== (profile?.first_name || '') ||
    formData.last_name !== (profile?.last_name || '') ||
    formData.business_name !== (profile?.business_name || '')
  );
}
