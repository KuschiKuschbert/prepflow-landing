import { useCallback } from 'react';
import { isValidAvatar, storeAvatar } from '@/lib/user-avatar';
import { useNotification } from '@/contexts/NotificationContext';

const AVATAR_STORAGE_KEY = 'prepflow-user-avatar';

interface UseAvatarUpdateProps {
  avatar: string | null;
  userEmail?: string;
  setAvatarState: (avatar: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Hook for updating avatar with optimistic updates
 */
export function useAvatarUpdate({
  avatar,
  userEmail,
  setAvatarState,
  setLoading,
  setError,
}: UseAvatarUpdateProps) {
  const { showSuccess, showError } = useNotification();

  const setAvatar = useCallback(
    async (avatarId: string | null) => {
      if (avatarId !== null && !isValidAvatar(avatarId)) {
        setError('Invalid avatar ID');
        showError('Invalid avatar selection');
        return;
      }
      if (avatar === avatarId) return;
      const originalAvatar = avatar;
      // Optimistically update UI immediately
      setAvatarState(avatarId);
      storeAvatar(avatarId);
      setError(null);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: AVATAR_STORAGE_KEY,
            newValue: avatarId,
          }),
        );
      }
      if (userEmail) {
        try {
          const response = await fetch('/api/user/avatar', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatar: avatarId }),
          });
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || data.message || 'Failed to update avatar');
          }
          const data = await response.json();
          const serverAvatar = data.avatar && isValidAvatar(data.avatar) ? data.avatar : null;
          setAvatarState(serverAvatar);
          storeAvatar(serverAvatar);
          showSuccess('Avatar updated successfully');
        } catch (err) {
          // Rollback on error
          setAvatarState(originalAvatar);
          storeAvatar(originalAvatar);
          const errorMessage = err instanceof Error ? err.message : 'Failed to update avatar';
          setError(errorMessage);
          showError(errorMessage);
        }
      }
    },
    [avatar, userEmail, setAvatarState, setError, showSuccess, showError],
  );

  return { setAvatar };
}
