'use client';

import { clearSessionStats } from '@/lib/arcadeStats';
import { clearAllDrafts } from '@/lib/autosave-storage';
import { useUser } from '@auth0/nextjs-auth0/client';

export function LogoutButton() {
  const { user } = useUser();
  const userId = user?.email || null;

  const handleLogout = async () => {
    // Clear all autosave drafts
    clearAllDrafts(userId);

    // Clear session stats (reset navbar scores on logout, but keep persistent stats in Settings)
    clearSessionStats();

    // Logout via Auth0 SDK - redirects to Auth0 logout then back to home
    const returnTo = `${window.location.origin}/`;
    window.location.href = `/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`;
  };

  return (
    <button
      onClick={handleLogout}
      className="desktop:min-h-0 desktop:py-1.5 min-h-[44px] rounded-lg border border-[var(--color-error)]/50 bg-[var(--color-error)]/10 px-3 py-2 text-sm font-medium text-[var(--color-error)] transition-all duration-200 hover:bg-[var(--color-error)]/20 active:scale-[0.98]"
      aria-label="Logout"
      title="Logout"
    >
      Logout
    </button>
  );
}
