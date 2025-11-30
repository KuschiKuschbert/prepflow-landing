'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { getStoredAvatar, isValidAvatar, storeAvatar } from '@/lib/user-avatar';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

const AVATAR_STORAGE_KEY = 'prepflow-user-avatar';

interface UseUserAvatarReturn {
  avatar: string | null;
  setAvatar: (avatarId: string | null) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to manage user avatar preference with database and localStorage sync.
 *
 * @returns {UseUserAvatarReturn} Avatar management hook
 * @returns {string | null} returns.avatar - Current avatar ID or null
 * @returns {Function} returns.setAvatar - Function to update avatar preference
 * @returns {boolean} returns.loading - Loading state
 * @returns {string | null} returns.error - Error message or null
 *
 * @example
 * ```typescript
 * const { avatar, setAvatar, loading } = useUserAvatar();
 * await setAvatar('avatar-01');
 * ```
 */
export function useUserAvatar(): UseUserAvatarReturn {
  const { data: session } = useSession();
  const { showSuccess, showError } = useNotification();
  const [avatar, setAvatarState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load avatar from localStorage on mount (for instant display)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = getStoredAvatar();
      if (stored) {
        setAvatarState(stored);
      }
    } catch {
      // Invalid stored data, ignore
    }

    setIsHydrated(true);
  }, []);

  // Fetch avatar from API on mount (if authenticated)
  useEffect(() => {
    if (!isHydrated || !session?.user?.email) return;

    const fetchAvatar = async () => {
      try {
        const response = await fetch('/api/user/avatar');
        if (response.ok) {
          const data = await response.json();
          const avatarId = data.avatar && isValidAvatar(data.avatar) ? data.avatar : null;
          setAvatarState(avatarId);
          // Sync to localStorage
          if (avatarId) {
            storeAvatar(avatarId);
          }
        }
      } catch (err) {
        // Silently fail - use localStorage fallback
        logger.dev('[useUserAvatar] Failed to fetch avatar from API:', err);
      }
    };

    fetchAvatar();
  }, [isHydrated, session?.user?.email]);

  // Listen to storage events for cross-tab sync
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AVATAR_STORAGE_KEY) {
        const newAvatar = e.newValue && isValidAvatar(e.newValue) ? e.newValue : null;
        setAvatarState(newAvatar);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update avatar (optimistic update with API sync)
  const setAvatar = useCallback(
    async (avatarId: string | null) => {
      // Validate avatar ID
      if (avatarId !== null && !isValidAvatar(avatarId)) {
        setError('Invalid avatar ID');
        showError('Invalid avatar selection');
        return;
      }

      // Don't update if avatar hasn't changed or if already loading
      if (avatar === avatarId || loading) {
        return;
      }

      // Store original state for rollback
      const originalAvatar = avatar;

      // Optimistically update UI immediately
      setAvatarState(avatarId);
      storeAvatar(avatarId);
      setLoading(true);
      setError(null);

      // Broadcast storage event for cross-tab sync
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: AVATAR_STORAGE_KEY,
            newValue: avatarId,
          }),
        );
      }

      // Sync with API if authenticated
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/user/avatar', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ avatar: avatarId }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || data.message || 'Failed to update avatar');
          }

          const data = await response.json();
          // Ensure we have the correct avatar from server
          const serverAvatar = data.avatar && isValidAvatar(data.avatar) ? data.avatar : null;
          setAvatarState(serverAvatar);
          storeAvatar(serverAvatar);
          showSuccess('Avatar updated successfully');
        } catch (err) {
          // Revert optimistic update on error
          setAvatarState(originalAvatar);
          storeAvatar(originalAvatar);
          const errorMessage = err instanceof Error ? err.message : 'Failed to update avatar';
          setError(errorMessage);
          showError(errorMessage);
        } finally {
          setLoading(false);
        }
      } else {
        // Not authenticated - just use localStorage
        setLoading(false);
      }
    },
    [avatar, loading, session?.user?.email, showSuccess, showError],
  );

  return {
    avatar,
    setAvatar,
    loading,
    error,
  };
}
