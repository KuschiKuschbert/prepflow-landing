import { logger } from '@/lib/logger';

const STORAGE_PREFIX = 'autosave';

export interface DraftMetadata {
  entityType: string;
  entityId: string;
  userId: string;
  timestamp: number;
  data: unknown;
}

function getStorageKey(entityType: string, entityId: string, userId: string | null): string {
  const user = userId || 'anonymous';
  return `${STORAGE_PREFIX}_${entityType}_${entityId}_${user}`;
}

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
    logger.error('Error saving draft to localStorage:', error);
    // localStorage might be full or disabled, continue silently
  }
}

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
    logger.error('Error reading draft from localStorage:', error);
    return null;
  }
}

export function clearDraft(
  entityType: string,
  entityId: string,
  userId: string | null = null,
): void {
  try {
    const key = getStorageKey(entityType, entityId, userId);
    localStorage.removeItem(key);
  } catch (error) {
    logger.error('Error clearing draft from localStorage:', error);
  }
}

export function getAllDrafts(userId: string | null = null): DraftMetadata[] {
  const drafts: DraftMetadata[] = [];

  try {
    const prefix = `${STORAGE_PREFIX}_`;
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
          logger.error(`Error parsing draft ${key}:`, error);
        }
      }
    }
  } catch (error) {
    logger.error('Error getting all drafts:', error);
  }

  return drafts;
}

export function clearAllDrafts(userId: string | null = null): void {
  try {
    const drafts = getAllDrafts(userId);
    drafts.forEach(draft => {
      clearDraft(draft.entityType, draft.entityId, draft.userId);
    });
  } catch (error) {
    logger.error('Error clearing all drafts:', error);
  }
}

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
    logger.error('Error getting storage info:', error);
    return { used: 0, total: 0, percentage: 0 };
  }
}
