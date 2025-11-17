import { getAllDrafts } from '../autosave-storage';
import { type EntityType } from '../autosave-sync-utils';
import { syncToDatabase } from './databaseSync';

export async function syncAllDrafts(
  userId: string | null = null,
  onProgress?: (synced: number, total: number) => void,
): Promise<{ synced: number; failed: number; errors: string[] }> {
  const drafts = getAllDrafts(userId);
  let synced = 0;
  let failed = 0;
  const errors: string[] = [];
  for (let i = 0; i < drafts.length; i++) {
    const draft = drafts[i];
    const result = await syncToDatabase(
      draft.entityType as EntityType,
      draft.entityId,
      draft.data,
      draft.userId,
    );
    if (result.success) {
      synced++;
    } else {
      failed++;
      errors.push(`${draft.entityType}/${draft.entityId}: ${result.error || 'Unknown error'}`);
    }
    if (onProgress) onProgress(synced + failed, drafts.length);
    if (i < drafts.length - 1) await new Promise(resolve => setTimeout(resolve, 100));
  }
  return { synced, failed, errors };
}

export async function retryFailedSyncs(
  userId: string | null = null,
): Promise<{ retried: number; stillFailed: number }> {
  const drafts = getAllDrafts(userId);
  let retried = 0;
  let stillFailed = 0;
  for (const draft of drafts) {
    const age = Date.now() - draft.timestamp;
    if (age > 60000) {
      const result = await syncToDatabase(
        draft.entityType as EntityType,
        draft.entityId,
        draft.data,
        draft.userId,
      );
      if (result.success) retried++;
      else stillFailed++;
    }
  }
  return { retried, stillFailed };
}
