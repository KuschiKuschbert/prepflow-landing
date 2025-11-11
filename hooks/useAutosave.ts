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
  const session = useSession();
  // Safely destructure session data, handling undefined during SSR
  const sessionData = session?.data;
  const userId = sessionData?.user?.email || null;

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

    // Broadcast status for global indicators
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('autosave:status', {
            detail: { status: 'saving', entityType, entityId },
          }),
        );
      }
    } catch {}

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

        // Broadcast saved
        try {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('autosave:status', {
                detail: { status: 'saved', entityType, entityId },
              }),
            );
          }
        } catch {}

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
      // Extract detailed error message with comprehensive error handling
      let errorMessage = 'Failed to save changes';

      // Handle Supabase PostgrestError and other structured errors
      if (err && typeof err === 'object') {
        const errorObj = err as Record<string, unknown>;

        // Supabase errors have message, details, hint, and code
        if (errorObj.message) {
          errorMessage = String(errorObj.message);
          // Add details if available
          if (errorObj.details && String(errorObj.details).trim()) {
            errorMessage += `: ${errorObj.details}`;
          }
          // Add hint if available
          if (errorObj.hint && String(errorObj.hint).trim()) {
            errorMessage += ` (${errorObj.hint})`;
          }
        } else if (errorObj.details) {
          errorMessage = String(errorObj.details);
        } else if (errorObj.hint) {
          errorMessage = String(errorObj.hint);
        } else if ('code' in errorObj && errorObj.code) {
          errorMessage = `Database error (${String(errorObj.code)})`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message || 'Failed to save changes';
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      // Log full error for debugging
      console.error(`Autosave error for ${entityType}/${entityId}:`, err);
      console.error('Full error object:', JSON.stringify(err, Object.getOwnPropertyNames(err)));

      setStatus('error');
      setError(errorMessage);

      // Broadcast error
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('autosave:status', {
              detail: { status: 'error', entityType, entityId, error: errorMessage },
            }),
          );
        }
      } catch {}

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
    const flushIfPending = async () => {
      if (hasUnsavedChanges) {
        await saveNow();
      }
    };

    const handleVisibility = async () => {
      if (document.visibilityState === 'hidden') {
        await flushIfPending();
      }
    };

    const handlePageHide = async () => {
      await flushIfPending();
    };

    const handleBeforeUnload = () => {
      // Fire-and-forget; synchronous save not guaranteed but we attempted earlier
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibility);
      window.addEventListener('pagehide', handlePageHide);
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibility);
        window.removeEventListener('pagehide', handlePageHide);
        window.removeEventListener('beforeunload', handleBeforeUnload);
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
