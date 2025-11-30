'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { cacheData, getCachedData, prefetchApi } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useSession } from 'next-auth/react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

interface ProfileData {
  email: string;
  first_name: string | null;
  last_name: string | null;
  business_name: string | null;
  created_at: string | null;
  last_login: string | null;
  email_verified: boolean;
}

/**
 * Profile information panel component for settings page.
 * Displays and allows editing of user profile information.
 *
 * @component
 * @returns {JSX.Element} Profile information panel
 */
function ProfileInformationPanelComponent() {
  const { showSuccess, showError } = useNotification();
  const { data: session } = useSession();
  // Get email from Auth0 session directly (fallback if API fails)
  const sessionEmail = session?.user?.email || null;

  // Load cached data once on mount (memoized to prevent recalculation on every render)
  const cachedProfile = useMemo(() => {
    return typeof window !== 'undefined' ? getCachedData<ProfileData>('user_profile') : null;
  }, []); // Empty deps - only calculate once on mount

  // Track component mount/unmount for debugging
  const mountIdRef = useRef<string | null>(null);
  const mountCountRef = useRef(0);

  // Track if initial data has been loaded to prevent overwriting user input
  const initialDataLoadedRef = useRef(!!cachedProfile); // Mark as loaded if we have cached data
  // Track if API call is in progress to prevent multiple simultaneous calls
  const isLoadingRef = useRef(false);
  // Track if user has modified form data to prevent overwriting user input
  // Use sessionStorage to persist across remounts (React StrictMode causes double mounts in dev)
  const USER_MODIFIED_KEY = 'profile_panel_user_modified';
  const userHasModifiedRef = useRef(
    typeof window !== 'undefined' ? sessionStorage.getItem(USER_MODIFIED_KEY) === 'true' : false,
  );
  // Store initial form values to prevent reset
  const initialFormValuesRef = useRef<{
    first_name: string;
    last_name: string;
    business_name: string;
  } | null>(null);

  const [loading, setLoading] = useState(!cachedProfile); // Only show loading if no cache
  const [saving, setSaving] = useState(false);
  // Initialize profile with email from session if available
  const [profile, setProfile] = useState<ProfileData | null>(
    cachedProfile ||
      (sessionEmail
        ? {
            email: sessionEmail,
            first_name: null,
            last_name: null,
            business_name: null,
            created_at: null,
            last_login: null,
            email_verified: false,
          }
        : null),
  );

  // Initialize form data from cached profile
  const initialFormData = useMemo(
    () => ({
      first_name: cachedProfile?.first_name || '',
      last_name: cachedProfile?.last_name || '',
      business_name: cachedProfile?.business_name || '',
    }),
    [], // Only calculate once on mount
  );

  // Store initial values in ref to prevent reset (only set once)
  if (initialFormValuesRef.current === null) {
    initialFormValuesRef.current = initialFormData;
  }

  const [formData, setFormData] = useState(initialFormData);

  // Update profile with session email if session becomes available and profile is empty
  useEffect(() => {
    if (sessionEmail && !profile?.email) {
      logger.dev('[ProfileInformationPanel] Setting profile from session email', {
        mountId: mountIdRef.current,
        sessionEmail,
      });
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
  }, [sessionEmail, profile?.email]);

  // Track formData changes to detect unexpected resets
  const prevFormDataRef = useRef(formData);
  useEffect(() => {
    // Log if formData changes unexpectedly (not from user input or save)
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
        stackTrace: new Error().stack,
      });
      prevFormDataRef.current = formData;
    }
  }, [formData]);

  // Track component mount/unmount
  useEffect(() => {
    mountCountRef.current += 1;
    mountIdRef.current = `mount-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    logger.dev('[ProfileInformationPanel] Component mounted', {
      mountId: mountIdRef.current,
      mountCount: mountCountRef.current,
      hasCachedProfile: !!cachedProfile,
      initialFormData,
    });

    return () => {
      logger.dev('[ProfileInformationPanel] Component unmounting', {
        mountId: mountIdRef.current,
        mountCount: mountCountRef.current,
        userHasModified: userHasModifiedRef.current,
      });
    };
  }, []);

  // Load profile data immediately on mount (no visibility check needed for first panel)
  // Only run once on mount - don't include cachedProfile or showError in deps
  useEffect(() => {
    const currentMountId = mountIdRef.current;

    // CRITICAL: If user has already modified the form, NEVER update formData from API
    // Check both ref and sessionStorage to persist across remounts
    const userHasModified =
      userHasModifiedRef.current ||
      (typeof window !== 'undefined' && sessionStorage.getItem(USER_MODIFIED_KEY) === 'true');

    if (userHasModified) {
      logger.dev('[ProfileInformationPanel] Skipping API call - user has modified form', {
        mountId: currentMountId,
        fromRef: userHasModifiedRef.current,
        fromStorage: typeof window !== 'undefined' && sessionStorage.getItem(USER_MODIFIED_KEY) === 'true',
      });
      return;
    }

    // Prevent multiple simultaneous API calls
    if (isLoadingRef.current) {
      logger.dev('[ProfileInformationPanel] Skipping API call - already loading', {
        mountId: currentMountId,
      });
      return;
    }

    // If we already have cached data, mark as loaded and skip API call entirely
    if (cachedProfile) {
      logger.dev('[ProfileInformationPanel] Using cached profile, skipping API call', {
        mountId: currentMountId,
        hasCachedData: true,
      });
      initialDataLoadedRef.current = true;
      setLoading(false);
      return;
    }

    // Prefetch API endpoint (in case it wasn't prefetched yet)
    prefetchApi('/api/user/profile');

    const loadProfile = async () => {
      // Mark as loading to prevent duplicate calls
      isLoadingRef.current = true;

      logger.dev('[ProfileInformationPanel] Starting API call', {
        mountId: currentMountId,
        userHasModified: userHasModifiedRef.current,
      });

      try {
        // Fetch fresh data
        const response = await fetch('/api/user/profile');

        // Handle 401 (Unauthorized) gracefully - user not authenticated
        if (response.status === 401) {
          logger.dev('[ProfileInformationPanel] User not authenticated (401), using session email', {
            mountId: currentMountId,
            sessionEmail,
          });
          // Use email from session if available, even if API fails
          if (sessionEmail && !profile) {
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
          // Don't show error for 401 - this is expected if user isn't logged in
          // Just set loading to false and use session data
          setLoading(false);
          isLoadingRef.current = false;
          return;
        }

        // Handle other error status codes
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || errorData.message || 'Failed to load profile';
          logger.error('[ProfileInformationPanel] API error:', {
            status: response.status,
            error: errorMessage,
            mountId: currentMountId,
          });
          // Only show error for non-401 errors
          showError(`Failed to load profile: ${errorMessage}`);
          setLoading(false);
          isLoadingRef.current = false;
          return;
        }

        const data = await response.json();
        const profileData = data.profile || data;
        if (profileData) {
          setProfile(profileData);

          // CRITICAL: Only update formData if:
          // 1. Initial data hasn't been loaded yet
          // 2. User hasn't modified the form (check both ref and sessionStorage)
          // 3. We're still on the same mount (component hasn't remounted)
          const userHasModifiedNow =
            userHasModifiedRef.current ||
            (typeof window !== 'undefined' && sessionStorage.getItem(USER_MODIFIED_KEY) === 'true');

          const shouldUpdateFormData =
            !initialDataLoadedRef.current &&
            !userHasModifiedNow &&
            mountIdRef.current === currentMountId;

          if (shouldUpdateFormData) {
            logger.dev('[ProfileInformationPanel] Updating formData from API response', {
              mountId: currentMountId,
              profileData: {
                first_name: profileData.first_name,
                last_name: profileData.last_name,
                business_name: profileData.business_name,
              },
            });
            setFormData({
              first_name: profileData.first_name || '',
              last_name: profileData.last_name || '',
              business_name: profileData.business_name || '',
            });
            initialDataLoadedRef.current = true;
          } else {
            logger.dev('[ProfileInformationPanel] NOT updating formData from API response', {
              mountId: currentMountId,
              initialDataLoaded: initialDataLoadedRef.current,
              userHasModified: userHasModifiedRef.current,
              sameMount: mountIdRef.current === currentMountId,
            });
          }

          // Cache for 5 minutes
          cacheData('user_profile', profileData, 5 * 60 * 1000);
        }
      } catch (error) {
        // Network errors or other unexpected errors
        logger.error('[ProfileInformationPanel] Network or unexpected error:', {
          error: error instanceof Error ? error.message : String(error),
          mountId: currentMountId,
        });
        // Only show error for unexpected errors (not 401)
        showError('Failed to load profile information. Please check your connection.');
      } finally {
        setLoading(false);
        isLoadingRef.current = false; // Reset loading flag
      }
    };

    // Load immediately - no visibility check needed for first panel
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  const handleSave = async () => {
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

      // Update profile state
      if (data.profile) {
        setProfile(data.profile);
        // Update formData to match saved profile (user's changes are now saved)
        // This is safe because we just saved these values
        logger.dev('[ProfileInformationPanel] Updating formData after successful save', {
          mountId: mountIdRef.current,
          savedProfile: data.profile,
        });
        setFormData({
          first_name: data.profile.first_name || '',
          last_name: data.profile.last_name || '',
          business_name: data.profile.business_name || '',
        });
        // Clear user modification flag since we've saved
        userHasModifiedRef.current = false;
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(USER_MODIFIED_KEY);
        }
      }

      showSuccess('Profile updated successfully');
    } catch (error) {
      logger.error('Failed to update profile:', error);
      showError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-[#2a2a2a]" />
        <div className="h-4 w-64 animate-pulse rounded bg-[#2a2a2a]" />
      </div>
    );
  }

  const hasChanges =
    formData.first_name !== (profile?.first_name || '') ||
    formData.last_name !== (profile?.last_name || '') ||
    formData.business_name !== (profile?.business_name || '');

  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <p className="mt-1 text-sm text-gray-300">
          Manage your personal information and account details.
        </p>
      </div>

      <div className="space-y-4">
        {/* Email (Read-only) */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={profile?.email || sessionEmail || ''}
            disabled
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-gray-400 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">
            Email is managed by your authentication provider and cannot be changed here.
          </p>
        </div>

        {/* First Name */}
        <div>
          <label htmlFor="first_name" className="mb-2 block text-sm font-medium text-gray-300">
            First Name
          </label>
            <input
              id="first_name"
              type="text"
              value={formData.first_name}
              onChange={e => {
                const newValue = e.target.value;
                logger.dev('[ProfileInformationPanel] First name onChange', {
                  mountId: mountIdRef.current,
                  newValue,
                  previousValue: formData.first_name,
                });
                userHasModifiedRef.current = true;
                // Persist to sessionStorage to survive remounts
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem(USER_MODIFIED_KEY, 'true');
                }
                setFormData(prev => {
                  const updated = { ...prev, first_name: newValue };
                  logger.dev('[ProfileInformationPanel] setFormData called for first_name', {
                    mountId: mountIdRef.current,
                    previous: prev.first_name,
                    updated: updated.first_name,
                  });
                  return updated;
                });
              }}
              maxLength={100}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="Enter your first name"
            />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="last_name" className="mb-2 block text-sm font-medium text-gray-300">
            Last Name
          </label>
            <input
              id="last_name"
              type="text"
              value={formData.last_name}
              onChange={e => {
                const newValue = e.target.value;
                logger.dev('[ProfileInformationPanel] Last name onChange', {
                  mountId: mountIdRef.current,
                  newValue,
                  previousValue: formData.last_name,
                });
                userHasModifiedRef.current = true;
                // Persist to sessionStorage to survive remounts
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem(USER_MODIFIED_KEY, 'true');
                }
                setFormData(prev => {
                  const updated = { ...prev, last_name: newValue };
                  logger.dev('[ProfileInformationPanel] setFormData called for last_name', {
                    mountId: mountIdRef.current,
                    previous: prev.last_name,
                    updated: updated.last_name,
                  });
                  return updated;
                });
              }}
              maxLength={100}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="Enter your last name"
            />
        </div>

        {/* Business Name */}
        <div>
          <label htmlFor="business_name" className="mb-2 block text-sm font-medium text-gray-300">
            Business Name
          </label>
            <input
              id="business_name"
              type="text"
              value={formData.business_name}
              onChange={e => {
                const newValue = e.target.value;
                logger.dev('[ProfileInformationPanel] Business name onChange', {
                  mountId: mountIdRef.current,
                  newValue,
                  previousValue: formData.business_name,
                });
                userHasModifiedRef.current = true;
                // Persist to sessionStorage to survive remounts
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem(USER_MODIFIED_KEY, 'true');
                }
                setFormData(prev => {
                  const updated = { ...prev, business_name: newValue };
                  logger.dev('[ProfileInformationPanel] setFormData called for business_name', {
                    mountId: mountIdRef.current,
                    previous: prev.business_name,
                    updated: updated.business_name,
                  });
                  return updated;
                });
              }}
              maxLength={255}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="Enter your business name"
            />
        </div>

        {/* Account Metadata */}
        <div className="border-t border-[#2a2a2a] pt-4">
          <div className="grid grid-cols-1 gap-3 desktop:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500">Account Created</p>
              <p className="text-sm font-medium text-gray-300">
                {formatDate(profile?.created_at || null)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last Login</p>
              <p className="text-sm font-medium text-gray-300">
                {formatDate(profile?.last_login || null)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email Verification</p>
              <p className="text-sm font-medium text-gray-300">
                {profile?.email_verified ? (
                  <span className="text-green-400">Verified</span>
                ) : (
                  <span className="text-yellow-400">Unverified</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <div className="flex justify-end gap-3 border-t border-[#2a2a2a] pt-4">
            <button
              onClick={() => {
                logger.dev('[ProfileInformationPanel] Cancel button clicked, resetting formData', {
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
                // Reset user modification flag since we're canceling changes
                userHasModifiedRef.current = false;
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem(USER_MODIFIED_KEY);
                }
              }}
              disabled={saving}
              className="rounded-2xl border border-[#2a2a2a] px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/40 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export const ProfileInformationPanel = memo(ProfileInformationPanelComponent);
