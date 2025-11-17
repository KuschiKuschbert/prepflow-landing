import { supabase } from '../supabase';
import {
  extractSupabaseErrorMessage,
  formatEntityData,
  checkEntityExists,
  type EntityType,
} from '../autosave-sync-utils';
import { clearDraft, saveDraft } from '../autosave-storage';
import { logger } from '@/lib/logger';

interface SyncResult {
  success: boolean;
  error?: string;
  entityId?: string;
}

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
        logger.warn(`Entity ${entityType}/${entityId} does not exist, skipping update`);
        return { success: true, entityId };
      }
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
        logger.error(`Supabase update error for ${entityType}/${entityId}:`, error);
        throw new Error(`${errorMessage}${errorCode}`);
      }
      if (!updatedData) {
        logger.warn(`Entity ${entityType}/${entityId} was deleted, skipping update`);
        return { success: true, entityId };
      }
      savedEntityId = updatedData?.id || entityId;
    } else {
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
        logger.error(`Supabase insert error for ${entityType}/${entityId}:`, error);
        throw new Error(`${errorMessage}${errorCode}`);
      }
      savedEntityId = newData?.id || entityId;
    }
    clearDraft(entityType, entityId, userId);
    if (!isUpdate && savedEntityId && savedEntityId !== entityId) {
      saveDraft(entityType, savedEntityId, data, userId);
      clearDraft(entityType, 'new', userId);
    }
    return { success: true, entityId: savedEntityId };
  } catch (error) {
    logger.error(`Error syncing ${entityType} ${entityId}:`, error);
    const errorMessage = extractSupabaseErrorMessage(error, 'Failed to save changes');
    logger.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return { success: false, error: errorMessage };
  }
}
