'use client';

import { memo } from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useProfileData } from './ProfileInformationPanel/hooks/useProfileData';
import { useProfileForm } from './ProfileInformationPanel/hooks/useProfileForm';
import { useProfileSave } from './ProfileInformationPanel/hooks/useProfileSave';
import { ProfileFormFields } from './ProfileInformationPanel/components/ProfileFormFields';
import { ProfileAccountMetadata } from './ProfileInformationPanel/components/ProfileAccountMetadata';
import { ProfileFormActions } from './ProfileInformationPanel/components/ProfileFormActions';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import type { ProfileData } from './ProfileInformationPanel/types';

/**
 * Profile information panel component for settings page.
 * Displays and allows editing of user profile information.
 *
 * @component
 * @returns {JSX.Element} Profile information panel
 */
function ProfileInformationPanelComponent() {
  const {
    profile,
    setProfile,
    loading,
    sessionEmail,
    mountIdRef,
    initialDataLoadedRef,
    userHasModifiedRef,
    USER_MODIFIED_KEY,
  } = useProfileData();

  const cachedProfile = getCachedData<ProfileData>('user_profile');

  const { formData, setFormData, handleFieldChange, resetForm, hasChanges } = useProfileForm({
    cachedProfile,
    profile,
    mountIdRef,
    userHasModifiedRef,
    initialDataLoadedRef,
    USER_MODIFIED_KEY,
    onProfileUpdate: updatedProfile => {
      setProfile(updatedProfile);
      cacheData('user_profile', updatedProfile, 5 * 60 * 1000);
    },
  });

  const { saving, handleSave } = useProfileSave({
    formData,
    setProfile,
    setFormData,
    userHasModifiedRef,
    USER_MODIFIED_KEY,
    mountIdRef,
  });

  if (loading) {
    return (
      <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
        <LoadingSkeleton variant="text" className="h-6 w-48" />
        <LoadingSkeleton variant="text" className="h-4 w-64" />
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <p className="mt-1 text-sm text-gray-300">
          Manage your personal information and account details.
        </p>
      </div>

      <ProfileFormFields
        email={profile?.email || sessionEmail || ''}
        formData={formData}
        onFieldChange={handleFieldChange}
      />

      <ProfileAccountMetadata
        created_at={profile?.created_at || null}
        last_login={profile?.last_login || null}
        email_verified={profile?.email_verified || false}
      />

      <ProfileFormActions
        hasChanges={hasChanges}
        saving={saving}
        onSave={handleSave}
        onCancel={resetForm}
      />
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export const ProfileInformationPanel = memo(ProfileInformationPanelComponent);
