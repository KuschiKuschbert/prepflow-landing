'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { COGSCalculation } from '../types';
import {
  saveRecipeIngredients,
  serializeCalculations,
} from './utils/recipeIngredientsAutosaveUtils';

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseRecipeIngredientsAutosaveOptions {
  recipeId: string | null;
  calculations: COGSCalculation[];
  debounceMs?: number;
  enabled?: boolean;
  onSave?: () => void;
  onError?: (error: string) => void;
}

export function useRecipeIngredientsAutosave({
  recipeId,
  calculations,
  debounceMs = 2500,
  enabled = true,
  onSave,
  onError,
}: UseRecipeIngredientsAutosaveOptions) {
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousCalculationsRef = useRef<string>('');

  const calculationsString = serializeCalculations(calculations);

  const performSave = useCallback(async () => {
    if (!recipeId || !enabled || calculations.length === 0) return;

    setStatus('saving');
    setError(null);

    const result = await saveRecipeIngredients(recipeId, calculations);
    if (result.success) {
      setStatus('saved');
      if (onSave) onSave();
      setTimeout(() => setStatus(prev => (prev === 'saved' ? 'idle' : prev)), 2000);
    } else {
      setStatus('error');
      setError(result.error || 'Failed to save');
      if (onError && result.error) onError(result.error);
    }
  }, [recipeId, calculations, enabled, onSave, onError]);

  // Clear error when autosave is disabled or recipe changes
  useEffect(() => {
    if (!enabled || !recipeId || calculations.length === 0) {
      setError(null);
      setStatus('idle');
      return;
    }
  }, [enabled, recipeId, calculations.length]);

  useEffect(() => {
    if (!enabled || !recipeId || calculations.length === 0) return;
    if (calculationsString === previousCalculationsRef.current) return;

    previousCalculationsRef.current = calculationsString;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(performSave, debounceMs);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [calculationsString, recipeId, enabled, debounceMs, performSave]);

  const saveNow = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    await performSave();
  }, [performSave]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  return { status, error, saveNow };
}
