'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { COGSCalculation } from '../types';
import { logger } from '../../lib/logger';
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

  const performSave = useCallback(
    async (force = false) => {
      if (!recipeId || (!enabled && !force)) {
        logger.dev('[Autosave] Save skipped:', { recipeId, enabled, force });
        return;
      }
      logger.dev('[Autosave] Starting save:', { recipeId, count: calculations.length, force });
      setStatus('saving');
      setError(null);
      const result = await saveRecipeIngredients(recipeId, calculations);
      if (result.success) {
        logger.dev('[Autosave] Save successful:', { recipeId, count: calculations.length });
        setStatus('saved');
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('recipe_ingredients_last_change', Date.now().toString());
        }
        if (onSave) onSave();
        setTimeout(() => setStatus(prev => (prev === 'saved' ? 'idle' : prev)), 2000);
      } else {
        logger.error('[Autosave] Save failed:', result.error);
        setStatus('error');
        setError(result.error || 'Failed to save');
        if (onError && result.error) onError(result.error);
      }
    },
    [recipeId, calculations, enabled, onSave, onError],
  );

  useEffect(() => {
    if (!enabled || !recipeId) {
      setError(null);
      setStatus('idle');
    }
  }, [enabled, recipeId]);

  useEffect(() => {
    if (!enabled || !recipeId) return;
    if (calculationsString === previousCalculationsRef.current) return;

    previousCalculationsRef.current = calculationsString;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(performSave, debounceMs);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [calculationsString, recipeId, enabled, debounceMs, performSave]);

  const saveNow = useCallback(async () => {
    logger.dev('[Autosave] saveNow called (force save)');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    await performSave(true);
  }, [performSave]);

  useEffect(
    () => () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    },
    [],
  );

  return { status, error, saveNow };
}
