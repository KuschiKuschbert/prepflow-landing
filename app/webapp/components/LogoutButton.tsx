'use client';

import { clearSessionStats } from '@/lib/arcadeStats';
import { clearAllDrafts } from '@/lib/autosave-storage';
import { signOut, useSession } from 'next-auth/react';

export function LogoutButton() {
  const session = useSession();
  // Safely destructure session data, handling undefined during SSR
  const sessionData = session?.data;
  const userId = sessionData?.user?.email || null;

  const handleLogout = async () => {
    // Clear all autosave drafts
    clearAllDrafts(userId);

    // Clear session stats (reset navbar scores on logout, but keep persistent stats in Settings)
    clearSessionStats();

    // Clear NextAuth session
    await signOut({ redirect: false });

    // Redirect to logout API which handles Auth0 logout
    const returnTo = `${window.location.origin}/`;
    window.location.href = `/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`;
  };

  return (
    <button
      onClick={handleLogout}
      className="desktop:min-h-0 desktop:py-1.5 min-h-[44px] rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20 active:scale-[0.98]"
      aria-label="Logout"
      title="Logout"
    >
      Logout
    </button>
  );
}
