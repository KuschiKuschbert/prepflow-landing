'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';
import { useAvatarSync } from './useUserAvatar/helpers/useAvatarSync';
import { useAvatarUpdate } from './useUserAvatar/helpers/useAvatarUpdate';

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
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { avatar, setAvatarState } = useAvatarSync({ userEmail: user?.email });
  const { setAvatar } = useAvatarUpdate({
    avatar,
    userEmail: user?.email,
    setAvatarState,
    setLoading,
    setError,
  });
  return { avatar, setAvatar, loading, error };
}
