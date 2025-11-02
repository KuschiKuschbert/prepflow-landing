/**
 * Autosave Storage Utility
 * Handles localStorage operations for draft data backup
 */

const STORAGE_PREFIX = 'autosave';
const USER_ID_PLACEHOLDER = '{userId}'; // Will be replaced with actual user ID

export interface DraftMetadata {
  entityType: string;
  entityId: string;
  userId: string;
  timestamp: number;
  data: unknown;
}

/**
 * Generate storage key for a draft
 */
function getStorageKey(entityType: string, entityId: string, userId: string | null): string {
  const user = userId || 'anonymous';
  return `${STORAGE_PREFIX}_${entityType}_${entityId}_${user}`;
}

/**
 * Save draft to localStorage
 */
export function saveDraft(
  entityType: string,
  entityId: string,
  data: unknown,
  userId: string | null = null,
): void {
  try {
    const key = getStorageKey(entityType, entityId, userId);
    const draft: DraftMetadata = {
      entityType,
      entityId,
      userId: userId || 'anonymous',
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(key, JSON.stringify(draft));
  } catch (error) {
    console.error('Error saving draft to localStorage:', error);
    // localStorage might be full or disabled, continue silently
  }
}

/**
 * Retrieve draft from localStorage
 */
export function getDraft(
  entityType: string,
  entityId: string,
  userId: string | null = null,
): DraftMetadata | null {
  try {
    const key = getStorageKey(entityType, entityId, userId);
    const item = localStorage.getItem(key);
    if (!item) return null;

    const draft = JSON.parse(item) as DraftMetadata;
    return draft;
  } catch (error) {
    console.error('Error reading draft from localStorage:', error);
    return null;
  }
}

/**
 * Clear a specific draft
 */
export function clearDraft(
  entityType: string,
  entityId: string,
  userId: string | null = null,
): void {
  try {
    const key = getStorageKey(entityType, entityId, userId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing draft from localStorage:', error);
  }
}

/**
 * Get all drafts for a user (or all drafts if userId is null)
 */
export function getAllDrafts(userId: string | null = null): DraftMetadata[] {
  const drafts: DraftMetadata[] = [];

  try {
    const prefix = userId ? `${STORAGE_PREFIX}_` : `${STORAGE_PREFIX}_`;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const draft = JSON.parse(item) as DraftMetadata;
            if (!userId || draft.userId === userId) {
              drafts.push(draft);
            }
          }
        } catch (error) {
          console.error(`Error parsing draft ${key}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error getting all drafts:', error);
  }

  return drafts;
}

/**
 * Clear all drafts for a user (or all drafts if userId is null)
 */
export function clearAllDrafts(userId: string | null = null): void {
  try {
    const drafts = getAllDrafts(userId);
    drafts.forEach(draft => {
      clearDraft(draft.entityType, draft.entityId, draft.userId);
    });
  } catch (error) {
    console.error('Error clearing all drafts:', error);
  }
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): { used: number; total: number; percentage: number } {
  try {
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const item = localStorage.getItem(key);
        if (item) {
          used += item.length + key.length;
        }
      }
    }

    // Approximate localStorage limit (usually 5-10MB, using 5MB as conservative estimate)
    const total = 5 * 1024 * 1024; // 5MB
    const percentage = (used / total) * 100;

    return { used, total, percentage };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { used: 0, total: 0, percentage: 0 };
  }
}
