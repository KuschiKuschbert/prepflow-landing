/**
 * User utility functions for consistent user ID management
 */

import { STORAGE_KEYS } from './constants';

/**
 * Generates a unique user ID with timestamp
 */
export const generateUserId = (): string => {
  return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
};

/**
 * Gets or creates a user ID from localStorage
 */
export const getOrCreateUserId = (): string => {
  if (typeof window === 'undefined') {
    return generateUserId();
  }

  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }
  return userId;
};

/**
 * Clears the user ID from localStorage
 */
export const clearUserId = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
  }
};
