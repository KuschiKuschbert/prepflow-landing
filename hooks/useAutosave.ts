'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { EntityType } from '@/lib/autosave-sync';
import { useUser } from '@auth0/nextjs-auth0/client';
import { performAutosave, setupAutosaveLifecycle } from './utils/autosaveLifecycle';
import { initializeDraftHelper } from './useAutosave/helpers/initializeDraft';
import { handleDataChangeHelper } from './useAutosave/helpers/handleDataChange';

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
  const { user } = useUser();
  const userId = user?.email || null;
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');
  const isInitialLoadRef = useRef(true);
  const dataString = JSON.stringify(data);

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

  useEffect(() => {
    initializeDraftHelper(entityId, enabled, entityType, userId, onSave);
    isInitialLoadRef.current = false;
  }, [entityType, entityId, userId, enabled, onSave]);
  useEffect(() => {
    handleDataChangeHelper(
      dataString,
      previousDataRef,
      enabled,
      entityId,
      isInitialLoadRef,
      entityType,
      data,
      userId,
      debounceMs,
      debounceTimerRef,
      performSave,
      setHasUnsavedChanges,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataString, entityType, entityId, userId, debounceMs, enabled, performSave]);

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
