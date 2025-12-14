/**
 * User avatar utilities.
 * Helper functions for working with user avatars.
 */

import { getAvatarById, isValidAvatar } from './avatars';

const AVATAR_STORAGE_KEY = 'prepflow-user-avatar';

/**
 * Get full image URL for avatar.
 *
 * @param {string | null} avatarId - Avatar ID (e.g., "avatar-01") or null
 * @returns {string | null} Full image path or null if no avatar
 */
export function getAvatarUrl(avatarId: string | null | undefined): string | null {
  if (!avatarId) return null;
  const avatar = getAvatarById(avatarId);
  return avatar?.imagePath || null;
}

/**
 * Get default avatar (initials) for user.
 * Generates initials from user name or email.
 *
 * @param {string | { first_name?: string | null; last_name?: string | null; name?: string | null; email?: string | null }} userNameOrUser - User name string or user object with name fields
 * @returns {string} First letter(s) of name/email, uppercase
 */
export function getDefaultAvatar(
  userNameOrUser:
    | string
    | null
    | undefined
    | {
        first_name?: string | null;
        last_name?: string | null;
        name?: string | null;
        email?: string | null;
      },
): string {
  // Handle user object format (preferred - uses database first_name/last_name)
  if (userNameOrUser && typeof userNameOrUser === 'object') {
    const { first_name, last_name, name, email } = userNameOrUser;

    // First choice: first_name + last_name (best initials)
    if (first_name && last_name) {
      return (first_name[0] + last_name[0]).toUpperCase();
    }

    // Second choice: first_name only
    if (first_name) {
      return first_name[0].toUpperCase();
    }

    // Third choice: full name string
    if (name) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name[0].toUpperCase();
    }

    // Fourth choice: email prefix
    if (email) {
      const emailPrefix = email.split('@')[0];
      return emailPrefix[0].toUpperCase();
    }

    return 'U';
  }

  // Handle string format (backward compatibility)
  const userName = userNameOrUser;
  if (!userName) return 'U';
  const parts = userName.trim().split(/\s+/);
  if (parts.length >= 2) {
    // First letter of first name + first letter of last name
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  // First letter of name or email
  return userName[0].toUpperCase();
}

/**
 * Get avatar from localStorage.
 *
 * @returns {string | null} Avatar ID or null if not set
 */
export function getStoredAvatar(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(AVATAR_STORAGE_KEY);
    return stored && isValidAvatar(stored) ? stored : null;
  } catch {
    return null;
  }
}

/**
 * Store avatar in localStorage.
 *
 * @param {string | null} avatarId - Avatar ID to store
 */
export function storeAvatar(avatarId: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (avatarId && isValidAvatar(avatarId)) {
      localStorage.setItem(AVATAR_STORAGE_KEY, avatarId);
    } else {
      localStorage.removeItem(AVATAR_STORAGE_KEY);
    }
  } catch {
    // Storage quota exceeded or disabled, ignore
  }
}

/**
 * Clear stored avatar from localStorage.
 */
export function clearStoredAvatar(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AVATAR_STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}

/**
 * Validate avatar ID.
 *
 * @param {string | null} avatarId - Avatar ID to validate
 * @returns {boolean} True if valid
 */
export { isValidAvatar };
