'use client';

import { supabase } from '@/lib/supabase';
import { useCallback } from 'react';

import { logger } from '@/lib/logger';
interface UseIngredientDeleteProps<T extends { id: string }> {
  setIngredients: React.Dispatch<React.SetStateAction<T[]>>;
  setError: (error: string) => void;
}

export function useIngredientDelete<T extends { id: string }>({
  setIngredients,
  setError,
}: UseIngredientDeleteProps<T>) {
  const handleDeleteIngredient = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from('ingredients').delete().eq('id', id);

        if (error) {
          if (error.code === '42501' || error.message?.includes('row-level security')) {
            logger.warn('RLS policy blocked direct delete, falling back to API route');
            const response = await fetch(`/api/ingredients?id=${encodeURIComponent(id)}`, {
              method: 'DELETE',
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
              const errorMsg = result.details || result.error || 'Failed to delete ingredient';
              setError(`Failed to delete ingredient: ${errorMsg}`);
              throw new Error(errorMsg);
            }
          } else {
            throw error;
          }
        }

        setIngredients(prev => prev.filter(ing => ing.id !== id));
      } catch (error) {
        setError('Failed to delete ingredient');
      }
    },
    [setIngredients, setError],
  );

  return { handleDeleteIngredient };
}
