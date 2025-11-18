import { useEffect } from 'react';
import { AutosaveStatus } from '../useRecipeIngredientsAutosave';

interface AutosaveEffectsProps {
  enabled: boolean;
  recipeId: string | null;
  setStatus: React.Dispatch<React.SetStateAction<AutosaveStatus>>;
  setError: (error: string | null) => void;
}

/**
 * Effect to reset autosave state when disabled or recipe changes.
 *
 * @param {AutosaveEffectsProps} props - Effect dependencies
 */
export function useAutosaveResetEffect({
  enabled,
  recipeId,
  setStatus,
  setError,
}: AutosaveEffectsProps) {
  useEffect(() => {
    if (!enabled || !recipeId) {
      setError(null);
      setStatus('idle');
    }
  }, [enabled, recipeId, setStatus, setError]);
}
