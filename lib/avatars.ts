/**
 * Avatar definitions and metadata.
 * Defines all available avatars for user selection.
 */

import { generateAvatarNames } from './avatar-names';

export interface Avatar {
  id: string;
  name: string;
  imagePath: string;
}

/**
 * Generate funny PrepFlow-style names for all avatars.
 */
const AVATAR_NAMES = generateAvatarNames(13);

/**
 * Available avatars with funny PrepFlow-style names.
 * These correspond to the processed avatar images.
 */
export const AVAILABLE_AVATARS: Avatar[] = Array.from({ length: 13 }, (_, index) => ({
  id: `avatar-${String(index + 1).padStart(2, '0')}`,
  name: AVATAR_NAMES[index],
  imagePath: `/images/avatars/avatar-${String(index + 1).padStart(2, '0')}.webp`,
}));

/**
 * Get avatar by ID.
 *
 * @param {string} avatarId - Avatar ID (e.g., "avatar-01")
 * @returns {Avatar | undefined} Avatar object or undefined if not found
 */
export function getAvatarById(avatarId: string | null | undefined): Avatar | undefined {
  if (!avatarId) return undefined;
  return AVAILABLE_AVATARS.find(avatar => avatar.id === avatarId);
}

/**
 * Check if avatar ID is valid.
 *
 * @param {string} avatarId - Avatar ID to validate
 * @returns {boolean} True if avatar ID is valid
 */
export function isValidAvatar(avatarId: string | null | undefined): boolean {
  if (!avatarId) return false;
  return AVAILABLE_AVATARS.some(avatar => avatar.id === avatarId);
}

/**
 * Get all avatar IDs.
 *
 * @returns {string[]} Array of avatar IDs
 */
export function getAvatarIds(): string[] {
  return AVAILABLE_AVATARS.map(avatar => avatar.id);
}
