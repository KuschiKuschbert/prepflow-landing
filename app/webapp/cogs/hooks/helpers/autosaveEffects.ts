import { useEffect } from 'react';
import type { AutosaveStatus } from './autosave-types';

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
