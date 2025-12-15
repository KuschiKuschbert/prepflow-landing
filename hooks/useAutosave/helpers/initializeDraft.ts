/**
 * Initialize draft on mount.
 */
import { getDraft } from '@/lib/autosave-storage';
import type { EntityType } from '@/lib/autosave-sync';

export function initializeDraftHelper(
  entityId: string | null,
  enabled: boolean,
  entityType: EntityType,
  userId: string | null,
  onSave?: (savedData: unknown) => void,
): void {
  if (entityId && enabled) {
    const existingDraft = getDraft(entityType, entityId, userId);
    if (existingDraft && onSave) {
      // Optionally restore draft on mount
      // onSave(existingDraft.data);
    }
  }
}
