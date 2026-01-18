import { supabase } from '../supabase';
import { getAllDrafts } from '../autosave-storage';
import { type EntityType } from '../autosave-sync-utils';
import { logger } from '@/lib/logger';

interface ConflictInfo {
  entityType: string;
  entityId: string;
  localTimestamp: number;
  serverTimestamp: number;
}

export async function checkForConflicts(
  entityType: EntityType,
  entityId: string,
): Promise<ConflictInfo | null> {
  try {
    const localDraft = getAllDrafts().find(
      d => d.entityType === entityType && d.entityId === entityId,
    );
    if (!localDraft) return null;
    const { data: serverData, error } = await supabase
      .from(entityType)
      .select('updated_at')
      .eq('id', entityId)
      .maybeSingle();
    if (error || !serverData) return null;
    const serverTimestamp = serverData.updated_at ? new Date(serverData.updated_at).getTime() : 0;
    if (serverTimestamp > localDraft.timestamp) {
      return { entityType, entityId, localTimestamp: localDraft.timestamp, serverTimestamp };
    }
    return null;
  } catch (error) {
    logger.error('Error checking for conflicts:', error);
    return null;
  }
}
