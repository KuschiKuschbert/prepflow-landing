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
 * @param {string} userName - User name or email
 * @returns {string} First letter(s) of name/email, uppercase
 */
export function getDefaultAvatar(userName: string | null | undefined): string {
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



