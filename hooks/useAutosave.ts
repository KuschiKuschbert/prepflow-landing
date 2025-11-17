'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { saveDraft, clearDraft, getDraft } from '@/lib/autosave-storage';
import { EntityType } from '@/lib/autosave-sync';
import { useSession } from 'next-auth/react';
import { performAutosave, setupAutosaveLifecycle } from './utils/autosaveLifecycle';

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

export function useAutosave({
  entityType,
  entityId,
  data,
  debounceMs = 2500,
  enabled = true,
  onSave,
  onError,
  onConflict,
}: UseAutosaveOptions): UseAutosaveReturn {
  const session = useSession();
  const sessionData = session?.data;
  const userId = sessionData?.user?.email || null;
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');
  const isInitialLoadRef = useRef(true);
  const dataString = JSON.stringify(data);

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
  useEffect(() => {
    if (!enabled || !entityId || isInitialLoadRef.current) return;
    const hasChanged = dataString !== previousDataRef.current;
    if (!hasChanged) return;
    setHasUnsavedChanges(true);
    previousDataRef.current = dataString;
    saveDraft(entityType, entityId, data, userId);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(async () => await performSave(), debounceMs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataString, entityType, entityId, userId, debounceMs, enabled, performSave]);

  const performSave = useCallback(async () => {
    if (!entityId || !enabled) return;
    setStatus('saving');
    setError(null);
    const result = await performAutosave({
      entityType,
      entityId,
      data,
      userId,
      enabled,
      onConflict,
      onSave,
      onError,
    });
    if (result.success) {
      setStatus('saved');
      setHasUnsavedChanges(false);
      setTimeout(() => setStatus(prev => (prev === 'saved' ? 'idle' : prev)), 2000);
    } else {
      setStatus('error');
      setError(result.error || 'Failed to save');
    }
  }, [entityType, entityId, data, userId, enabled, onConflict, onSave, onError]);

  const saveNow = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    await performSave();
  }, [performSave]);
  useEffect(() => {
    const cleanup = setupAutosaveLifecycle(hasUnsavedChanges, saveNow);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { status, error, saveNow, hasUnsavedChanges };
}
