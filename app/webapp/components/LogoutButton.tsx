'use client';

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useUnsavedChanges } from '@/contexts/UnsavedChangesContext';

export function LogoutButton() {
  const { hasUnsavedChanges, unsavedSources, clearUnsavedChanges } = useUnsavedChanges();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleLogoutClick = () => {
    if (hasUnsavedChanges) {
      setShowConfirmDialog(true);
    } else {
      performLogout();
    }
  };

  const performLogout = async () => {
    // Clear unsaved changes tracking
    clearUnsavedChanges();

    // Clear NextAuth session
    await signOut({ redirect: false });

    // Redirect to logout API which handles Auth0 logout
    const returnTo = `${window.location.origin}/`;
    window.location.href = `/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`;
  };

  const handleConfirmLogout = () => {
    setShowConfirmDialog(false);
    performLogout();
  };

  const handleCancelLogout = () => {
    setShowConfirmDialog(false);
  };

  // Build message with unsaved sources
  const unsavedMessage =
    unsavedSources.length > 0
      ? `You have unsaved changes in: ${unsavedSources.join(', ')}.`
      : 'You have unsaved changes.';

  return (
    <>
      <button
        onClick={handleLogoutClick}
        className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20"
        aria-label="Logout"
        title={hasUnsavedChanges ? 'You have unsaved changes' : 'Logout'}
      >
        {hasUnsavedChanges && (
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-400" aria-hidden="true" />
        )}
        Logout
      </button>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Unsaved Changes"
        message={`${unsavedMessage} Are you sure you want to logout? Any unsaved changes will be lost.`}
        confirmLabel="Logout Anyway"
        cancelLabel="Cancel"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        variant="warning"
      />
    </>
  );
}
