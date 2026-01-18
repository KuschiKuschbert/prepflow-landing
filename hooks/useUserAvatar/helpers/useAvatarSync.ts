import { useEffect, useState } from 'react';
import { getStoredAvatar, isValidAvatar, storeAvatar } from '@/lib/user-avatar';
import { logger } from '@/lib/logger';

const AVATAR_STORAGE_KEY = 'prepflow-user-avatar';

interface UseAvatarSyncProps {
  userEmail?: string;
}

/**
 * Hook for syncing avatar between localStorage and API
 */
export function useAvatarSync({ userEmail }: UseAvatarSyncProps) {
  const [avatar, setAvatarState] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load avatar from localStorage on mount
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
    if (!isHydrated || !userEmail) return;
    const fetchAvatar = async () => {
      try {
        const response = await fetch('/api/user/avatar');
        if (response.ok) {
          const data = await response.json();
          const avatarId = data.avatar && isValidAvatar(data.avatar) ? data.avatar : null;
          setAvatarState(avatarId);
          if (avatarId) {
            storeAvatar(avatarId);
          }
        }
      } catch (err) {
        logger.dev('[useUserAvatar] Failed to fetch avatar from API:', err);
      }
    };
    fetchAvatar();
  }, [isHydrated, userEmail]);

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

  return { avatar, setAvatarState, isHydrated };
}
