'use client';

import { supabase } from '@/lib/supabase';
import { useCallback } from 'react';

import { logger } from '@/lib/logger';
interface UseIngredientEditSaveProps<T extends { id: string }> {
  setIngredients: React.Dispatch<React.SetStateAction<T[]>>;
  setEditingIngredient: (ingredient: T | null) => void;
  setError: (error: string) => void;
}

function extractSupabaseError(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const err = error as { message?: string; details?: string; hint?: string };
    const msg = err.message || err.details || err.hint || 'Failed to update ingredient';
    if (err.details && err.details !== err.message)
      return `${err.message || 'Update failed'}: ${err.details}`;
    if (err.hint && err.hint !== err.details) return `${msg} (${err.hint})`;
    return msg;
  }
  return error instanceof Error ? error.message : 'Failed to update ingredient';
}

export function useIngredientEditSave<T extends { id: string }>({
  setIngredients,
  setEditingIngredient,
  setError,
}: UseIngredientEditSaveProps<T>) {
  const handleSave = useCallback(
    async (ingredientId: string, ingredientData: Partial<T>) => {
      try {
        const { data, error } = await supabase
          .from('ingredients')
          .update({ ...ingredientData, updated_at: new Date().toISOString() })
          .eq('id', ingredientId)
          .select()
          .maybeSingle();

        if (error) {
          if (error.code === '42501' || error.message?.includes('row-level security')) {
            logger.warn('RLS policy blocked direct update, falling back to API route');
            const response = await fetch('/api/ingredients', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: ingredientId, ...ingredientData }),
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
              const errorMsg = result.details || result.error || 'Failed to update ingredient';
              setError(`Ingredient not found. It may have been deleted. Please refresh the page.`);
              setEditingIngredient(null);
              return;
            }

            setIngredients(prev => prev.map(ing => (ing.id === ingredientId ? result.data : ing)));
            setEditingIngredient(null);
            return;
          } else {
            throw new Error(extractSupabaseError(error));
          }
        }

        if (!data) {
          setError(`Ingredient not found. It may have been deleted. Please refresh the page.`);
          setEditingIngredient(null);
          return;
        }

        setIngredients(prev => prev.map(ing => (ing.id === ingredientId ? data : ing)));
        setEditingIngredient(null);
      } catch (error) {
        setError(extractSupabaseError(error));
        throw error;
      }
    },
    [setIngredients, setEditingIngredient, setError],
  );

  return { handleSave };
}
