/**
 * Autosave Sync Service
 * Handles synchronization of drafts between localStorage and database
 */

import { saveDraft, clearDraft, getAllDrafts, DraftMetadata } from './autosave-storage';
import { supabase } from './supabase';
import {
  formatIngredientName,
  formatBrandName,
  formatSupplierName,
  formatStorageLocation,
  formatTextInput,
} from './text-utils';

export type EntityType =
  | 'ingredients'
  | 'recipes'
  | 'recipes_ingredients'
  | 'menu_dishes'
  | 'suppliers'
  | 'supplier_price_lists'
  | 'compliance_records'
  | 'compliance_types'
  | 'order_lists'
  | 'prep_lists'
  | 'dish_sections'
  | 'temperature_equipment'
  | 'temperature_logs'
  | 'cleaning_tasks'
  | 'cleaning_areas';

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
    // Determine if this is an update or create operation
    const isUpdate = entityId !== 'new' && entityId !== null && entityId !== undefined;

    // Prepare data with formatting for ingredients
    let formattedData: Record<string, unknown> = {
      ...(typeof data === 'object' && data !== null ? data : {}),
    };

    // Apply formatting for ingredients
    if (entityType === 'ingredients') {
      if (formattedData.ingredient_name) {
        formattedData.ingredient_name = formatIngredientName(String(formattedData.ingredient_name));
      }
      if (formattedData.brand) {
        formattedData.brand = formatBrandName(String(formattedData.brand));
      }
      if (formattedData.supplier) {
        formattedData.supplier = formatSupplierName(String(formattedData.supplier));
      }
      if (formattedData.storage_location) {
        formattedData.storage_location = formatStorageLocation(
          String(formattedData.storage_location),
        );
      }
      if (formattedData.product_code) {
        formattedData.product_code = formatTextInput(String(formattedData.product_code));
      }
    }

    let savedEntityId = entityId;

    if (isUpdate) {
      // Update existing entity
      const { data: updatedData, error } = await supabase
        .from(entityType)
        .update(formattedData)
        .eq('id', entityId)
        .select()
        .single();

      if (error) {
        const errorMessage =
          error.message || error.details || error.hint || 'Database update failed';
        console.error(`Supabase update error for ${entityType}/${entityId}:`, error);
        throw new Error(`${errorMessage} (Code: ${error.code || 'unknown'})`);
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
        const errorMessage =
          error.message || error.details || error.hint || 'Database insert failed';
        console.error(`Supabase insert error for ${entityType}/${entityId}:`, error);
        throw new Error(`${errorMessage} (Code: ${error.code || 'unknown'})`);
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

    // Extract detailed error message
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return {
      success: false,
      error: errorMessage,
    };
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
      .single();

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
