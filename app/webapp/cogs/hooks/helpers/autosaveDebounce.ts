import { useEffect, useRef, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { saveRecipeIngredients } from '../utils/recipeIngredientsAutosaveUtils';
import { COGSCalculation } from '@/lib/types/cogs';
import { AutosaveStatus } from '../useRecipeIngredientsAutosave';

interface AutosaveDebounceProps {
  calculationsString: string;
  recipeId: string | null;
  calculations: COGSCalculation[];
  enabled: boolean;
  debounceMs: number;
  setStatus: React.Dispatch<React.SetStateAction<AutosaveStatus>>;
  setError: (error: string | null) => void;
  onSave?: () => void;
  onError?: (error: string) => void;
}

/**
 * Effect to debounce autosave when calculations change.
 *
 * @param {AutosaveDebounceProps} props - Effect dependencies
 * @returns {Function} Force save function
 */
export function useAutosaveDebounce({
  calculationsString,
  recipeId,
  calculations,
  enabled,
  debounceMs,
  setStatus,
  setError,
  onSave,
  onError,
}: AutosaveDebounceProps) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousCalculationsRef = useRef<string>('');

  const performSave = useCallback(
    async (force = false) => {
      if (!recipeId || (!enabled && !force)) {
        logger.dev('[Autosave] Save skipped:', { recipeId, enabled, force });
        return;
      }
      logger.dev('[Autosave] Starting save:', { recipeId, count: calculations.length, force });
      setStatus('saving');
      setError(null);
      try {
        const result = await saveRecipeIngredients(recipeId, calculations);
        if (result.success) {
          logger.dev('[Autosave] Save successful:', { recipeId, count: calculations.length });
          setStatus('saved');
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('recipe_ingredients_last_change', Date.now().toString());
          }
          if (onSave) onSave();
          setTimeout(
            () => setStatus((prev: AutosaveStatus) => (prev === 'saved' ? 'idle' : prev)),
            2000,
          );
        } else {
          logger.error('[Autosave] Save failed:', result.error);
          setStatus('error');
          setError(result.error || 'Failed to save');
          if (onError && result.error) onError(result.error);
        }
      } catch (error) {
        logger.error('[Autosave] Error saving recipe ingredients:', {
          error: error instanceof Error ? error.message : String(error),
          recipeId,
        });
        setStatus('error');
        setError('Failed to save');
        if (onError) onError('Failed to save');
      }
    },
    [recipeId, calculations, enabled, onSave, onError, setStatus, setError],
  );

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

  useEffect(
    () => () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    },
    [],
  );

  const saveNow = useCallback(async () => {
    logger.dev('[Autosave] saveNow called (force save)');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    await performSave(true);
  }, [performSave]);

  return saveNow;
}
