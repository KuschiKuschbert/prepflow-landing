'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { clearAllDrafts } from '@/lib/autosave-storage';
import { useSession } from 'next-auth/react';

export function LogoutButton() {
  const { data: session } = useSession();
  const userId = session?.user?.email || null;

  const handleLogout = async () => {
    // Clear all autosave drafts
    clearAllDrafts(userId);

    // Clear NextAuth session
    await signOut({ redirect: false });

    // Redirect to logout API which handles Auth0 logout
    const returnTo = `${window.location.origin}/`;
    window.location.href = `/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`;
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20"
      aria-label="Logout"
      title="Logout"
    >
      Logout
    </button>
  );
}
