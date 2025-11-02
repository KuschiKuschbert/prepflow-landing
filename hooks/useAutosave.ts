'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { saveDraft, clearDraft, getDraft } from '@/lib/autosave-storage';
import { syncToDatabase, checkForConflicts, EntityType } from '@/lib/autosave-sync';
import { useSession } from 'next-auth/react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutosaveOptions {
  entityType: EntityType;
  entityId: string | null;
  data: unknown;
  debounceMs?: number;
  enabled?: boolean;
  onSave?: (savedData: unknown) => void;
  onError?: (error: string) => void;
  onConflict?: (conflictInfo: { localTimestamp: number; serverTimestamp: number }) => void;
}

interface UseAutosaveReturn {
  status: SaveStatus;
  error: string | null;
  saveNow: () => Promise<void>;
  hasUnsavedChanges: boolean;
}

/**
 * Custom hook for autosave functionality
 * Debounces saves, manages localStorage backup, and syncs to database
 */
export function useAutosave({
  entityType,
  entityId,
  data,
  debounceMs = 2500, // 2.5 seconds default
  enabled = true,
  onSave,
  onError,
  onConflict,
}: UseAutosaveOptions): UseAutosaveReturn {
  const { data: session } = useSession();
  const userId = session?.user?.email || null;

  const [status, setStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');
  const isInitialLoadRef = useRef(true);

  // Serialize data for comparison
  const dataString = JSON.stringify(data);

  // Check for existing draft on mount
  useEffect(() => {
    if (entityId && enabled) {
      const existingDraft = getDraft(entityType, entityId, userId);
      if (existingDraft && onSave) {
        // Optionally restore draft on mount
        // onSave(existingDraft.data);
      }
    }
    isInitialLoadRef.current = false;
  }, [entityType, entityId, userId, enabled, onSave]);

  // Save to localStorage immediately on data change
  useEffect(() => {
    if (!enabled || !entityId || isInitialLoadRef.current) return;

    const hasChanged = dataString !== previousDataRef.current;
    if (!hasChanged) return;

    setHasUnsavedChanges(true);
    previousDataRef.current = dataString;

    // Save to localStorage immediately
    saveDraft(entityType, entityId, data, userId);

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set up new debounce timer
    debounceTimerRef.current = setTimeout(async () => {
      await performSave();
    }, debounceMs);
  }, [dataString, entityType, entityId, userId, debounceMs, enabled]);

  // Perform the actual save operation
  const performSave = useCallback(async () => {
    if (!entityId || !enabled) return;

    setStatus('saving');
    setError(null);

    try {
      // Check for conflicts first (only for existing entities)
      if (entityId && entityId !== 'new' && entityId !== null && entityId !== undefined) {
        const conflict = await checkForConflicts(entityType, entityId);
        if (conflict && onConflict) {
          onConflict({
            localTimestamp: conflict.localTimestamp,
            serverTimestamp: conflict.serverTimestamp,
          });
          // Continue with save anyway - let user decide via conflict handler
        }
      }

      // Sync to database
      const result = await syncToDatabase(entityType, entityId, data, userId);

      if (result.success) {
        setStatus('saved');
        setHasUnsavedChanges(false);
        clearDraft(entityType, entityId, userId);

        // Clear saved status after 2 seconds
        setTimeout(() => {
          setStatus(prev => (prev === 'saved' ? 'idle' : prev));
        }, 2000);

        if (onSave) {
          onSave(data);
        }
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setStatus('error');
      setError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    }
  }, [entityType, entityId, data, userId, enabled, onConflict, onSave, onError]);

  // Manual save function
  const saveNow = useCallback(async () => {
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    await performSave();
  }, [performSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    status,
    error,
    saveNow,
    hasUnsavedChanges,
  };
}
