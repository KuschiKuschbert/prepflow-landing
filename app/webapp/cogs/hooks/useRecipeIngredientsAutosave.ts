'use client';

import { useState } from 'react';
import { COGSCalculation } from '@/lib/types/cogs';
import { useAutosaveResetEffect } from './helpers/autosaveEffects';
import { useAutosaveDebounce } from './helpers/autosaveDebounce';
import { serializeCalculations } from './utils/recipeIngredientsAutosaveUtils';
import type { AutosaveStatus } from './helpers/autosave-types';

export type { AutosaveStatus } from './helpers/autosave-types';

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
  const calculationsString = serializeCalculations(calculations);

  useAutosaveResetEffect({ enabled, recipeId, setStatus, setError });

  const saveNow = useAutosaveDebounce({
    calculationsString,
    recipeId,
    calculations,
    enabled,
    debounceMs,
    setStatus,
    setError,
    onSave,
    onError,
  });

  return { status, error, saveNow };
}
