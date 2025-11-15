/**
 * Autosave Sync Service
 * Handles synchronization of drafts between localStorage and database
 */

import { saveDraft, clearDraft, getAllDrafts, DraftMetadata } from './autosave-storage';
import { supabase } from './supabase';
import {
  extractSupabaseErrorMessage,
  formatEntityData,
  checkEntityExists,
  type EntityType,
} from './autosave-sync-utils';

export type { EntityType };

interface SyncResult {
  success: boolean;
  error?: string;
  entityId?: string;
}

interface ConflictInfo {
  entityType: string;
  entityId: string;
  localTimestamp: number;
  serverTimestamp: number;
}

/**
 * Sync a single draft to database
 */
export async function syncToDatabase(
  entityType: EntityType,
  entityId: string,
  data: unknown,
  userId: string | null = null,
): Promise<SyncResult> {
  try {
    const isUpdate = entityId !== 'new' && entityId !== null && entityId !== undefined;
    const formattedData = formatEntityData(
      entityType,
      (typeof data === 'object' && data !== null ? data : {}) as Record<string, unknown>,
    );

    let savedEntityId = entityId;

    if (isUpdate) {
      const exists = await checkEntityExists(entityType, entityId);
      if (!exists) {
        console.warn(`Entity ${entityType}/${entityId} does not exist, skipping update`);
        return { success: true, entityId };
      }

      // Update existing entity
      const { data: updatedData, error } = await supabase
        .from(entityType)
        .update(formattedData)
        .eq('id', entityId)
        .select()
        .maybeSingle();

      if (error) {
        const errorMessage = extractSupabaseErrorMessage(error, 'Database update failed');
        const errorCode = (error as { code?: string })?.code
          ? ` (Code: ${(error as { code: string }).code})`
          : '';
        console.error(`Supabase update error for ${entityType}/${entityId}:`, error);
        throw new Error(`${errorMessage}${errorCode}`);
      }

      // Handle case where entity was deleted between check and update
      if (!updatedData) {
        console.warn(`Entity ${entityType}/${entityId} was deleted, skipping update`);
        return { success: true, entityId };
      }

      savedEntityId = updatedData?.id || entityId;
    } else {
      // Create new entity
      const { data: newData, error } = await supabase
        .from(entityType)
        .insert([formattedData])
        .select()
        .single();

      if (error) {
        const errorMessage = extractSupabaseErrorMessage(error, 'Database insert failed');
        const errorCode = (error as { code?: string })?.code
          ? ` (Code: ${(error as { code: string }).code})`
          : '';
        console.error(`Supabase insert error for ${entityType}/${entityId}:`, error);
        throw new Error(`${errorMessage}${errorCode}`);
      }
      savedEntityId = newData?.id || entityId;
    }

    // Clear draft after successful save
    clearDraft(entityType, entityId, userId);

    // Save as new draft with updated ID if it was a new entity
    if (!isUpdate && savedEntityId && savedEntityId !== entityId) {
      saveDraft(entityType, savedEntityId, data, userId);
      clearDraft(entityType, 'new', userId);
    }

    return {
      success: true,
      entityId: savedEntityId,
    };
  } catch (error) {
    console.error(`Error syncing ${entityType} ${entityId}:`, error);
    const errorMessage = extractSupabaseErrorMessage(error, 'Failed to save changes');
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return { success: false, error: errorMessage };
  }
}

/**
 * Sync all pending drafts
 */
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

    if (onProgress) {
      onProgress(synced + failed, drafts.length);
    }

    // Small delay to avoid overwhelming the server
    if (i < drafts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return { synced, failed, errors };
}

/**
 * Check for conflicts between local and server data
 */
export async function checkForConflicts(
  entityType: EntityType,
  entityId: string,
): Promise<ConflictInfo | null> {
  try {
    // Get local draft
    const localDraft = getAllDrafts().find(
      d => d.entityType === entityType && d.entityId === entityId,
    );

    if (!localDraft) return null;

    // Fetch server version from Supabase
    const { data: serverData, error } = await supabase
      .from(entityType)
      .select('updated_at')
      .eq('id', entityId)
      .maybeSingle();

    // If entity doesn't exist, no conflict (entity may have been deleted)
    if (error || !serverData) return null;

    const serverTimestamp = serverData.updated_at ? new Date(serverData.updated_at).getTime() : 0;

    // Check if server version is newer
    if (serverTimestamp > localDraft.timestamp) {
      return {
        entityType,
        entityId,
        localTimestamp: localDraft.timestamp,
        serverTimestamp,
      };
    }

    return null;
  } catch (error) {
    console.error('Error checking for conflicts:', error);
    return null;
  }
}

/**
 * Retry failed syncs
 */
export async function retryFailedSyncs(
  userId: string | null = null,
): Promise<{ retried: number; stillFailed: number }> {
  const drafts = getAllDrafts(userId);
  let retried = 0;
  let stillFailed = 0;

  for (const draft of drafts) {
    // Only retry drafts older than 1 minute (assuming they failed)
    const age = Date.now() - draft.timestamp;
    if (age > 60000) {
      const result = await syncToDatabase(
        draft.entityType as EntityType,
        draft.entityId,
        draft.data,
        draft.userId,
      );

      if (result.success) {
        retried++;
      } else {
        stillFailed++;
      }
    }
  }

  return { retried, stillFailed };
}
