/**
 * Load profile data from API.
 */
import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { ProfileData } from '../../../types';

export async function loadProfileHelper(
  sessionEmail: string | null,
  setProfile: (profile: ProfileData | null) => void,
  setLoading: (loading: boolean) => void,
  isLoadingRef: React.MutableRefObject<boolean>,
  showError: (message: string) => void,
  mountId: string | null,
): Promise<void> {
  isLoadingRef.current = true;
  logger.dev('[ProfileInformationPanel] Starting API call', { mountId });
  try {
    const response = await fetch('/api/user/profile');
    if (response.status === 401) {
      logger.dev('[ProfileInformationPanel] User not authenticated (401), using session email', {
        mountId,
        sessionEmail,
      });
      if (sessionEmail) {
        setProfile({
          email: sessionEmail,
          first_name: null,
          last_name: null,
          business_name: null,
          created_at: null,
          last_login: null,
          email_verified: false,
        });
      }
      setLoading(false);
      isLoadingRef.current = false;
      return;
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || errorData.message || 'Failed to load profile';
      logger.error('[ProfileInformationPanel] API error:', {
        status: response.status,
        error: errorMessage,
        mountId,
      });
      showError(`Failed to load profile: ${errorMessage}`);
      setLoading(false);
      isLoadingRef.current = false;
      return;
    }
    const data = await response.json();
    const profileData = data.profile || data;
    if (profileData) {
      setProfile(profileData);
      cacheData('user_profile', profileData, 5 * 60 * 1000);
    }
  } catch (error) {
    logger.error('[ProfileInformationPanel] Network or unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      mountId,
    });
    showError('Failed to load profile information. Please check your connection.');
  } finally {
    setLoading(false);
    isLoadingRef.current = false;
  }
}
