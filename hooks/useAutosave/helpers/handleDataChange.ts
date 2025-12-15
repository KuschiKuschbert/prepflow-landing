/**
 * Handle data change and trigger autosave.
 */
import { saveDraft } from '@/lib/autosave-storage';
import type { EntityType } from '@/lib/autosave-sync';

export function handleDataChangeHelper(
  dataString: string,
  previousDataRef: React.MutableRefObject<string>,
  enabled: boolean,
  entityId: string | null,
  isInitialLoadRef: React.MutableRefObject<boolean>,
  entityType: EntityType,
  data: unknown,
  userId: string | null,
  debounceMs: number,
  debounceTimerRef: React.MutableRefObject<NodeJS.Timeout | null>,
  performSave: () => Promise<void>,
  setHasUnsavedChanges: (hasChanges: boolean) => void,
): void {
  if (!enabled || !entityId || isInitialLoadRef.current) return;
  const hasChanged = dataString !== previousDataRef.current;
  if (!hasChanged) return;
  setHasUnsavedChanges(true);
  previousDataRef.current = dataString;
  saveDraft(entityType, entityId, data, userId);
  if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
  debounceTimerRef.current = setTimeout(() => performSave(), debounceMs);
}
