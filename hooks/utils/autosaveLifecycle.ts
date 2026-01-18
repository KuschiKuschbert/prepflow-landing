import { clearDraft } from '@/lib/autosave-storage';
import { syncToDatabase, checkForConflicts, EntityType } from '@/lib/autosave-sync';
import { extractErrorMessage, broadcastAutosaveStatus, logAutosaveError } from './autosaveHelpers';

interface PerformSaveParams {
  entityType: EntityType;
  entityId: string | null;
  data: unknown;
  userId: string | null;
  enabled: boolean;
  onConflict?: (conflictInfo: { localTimestamp: number; serverTimestamp: number }) => void;
  onSave?: (savedData: unknown) => void;
  onError?: (error: string) => void;
}

export async function performAutosave({
  entityType,
  entityId,
  data,
  userId,
  enabled,
  onConflict,
  onSave,
  onError,
}: PerformSaveParams): Promise<{ success: boolean; error?: string }> {
  if (!entityId || !enabled) return { success: false };
  broadcastAutosaveStatus('saving', entityType, entityId);
  try {
    if (entityId && entityId !== 'new' && entityId !== null && entityId !== undefined) {
      const conflict = await checkForConflicts(entityType, entityId);
      if (conflict && onConflict) {
        onConflict({
          localTimestamp: conflict.localTimestamp,
          serverTimestamp: conflict.serverTimestamp,
        });
      }
    }
    const result = await syncToDatabase(entityType, entityId, data, userId);
    if (result.success) {
      clearDraft(entityType, entityId, userId);
      broadcastAutosaveStatus('saved', entityType, entityId);
      if (onSave) onSave(data);
      return { success: true };
    } else {
      throw new Error(result.error || 'Failed to save');
    }
  } catch (err) {
    const errorMessage = extractErrorMessage(err);
    logAutosaveError(entityType, entityId, err);
    broadcastAutosaveStatus('error', entityType, entityId, errorMessage);
    if (onError) onError(errorMessage);
    return { success: false, error: errorMessage };
  }
}

export function setupAutosaveLifecycle(
  hasUnsavedChanges: boolean,
  saveNow: () => Promise<void>,
): () => void {
  const flushIfPending = async () => {
    if (hasUnsavedChanges) await saveNow();
  };
  const handleVisibility = async () => {
    if (document.visibilityState === 'hidden') await flushIfPending();
  };
  const handlePageHide = async () => {
    await flushIfPending();
  };
  const handleBeforeUnload = () => {};
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handleBeforeUnload);
  }
  return () => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  };
}
