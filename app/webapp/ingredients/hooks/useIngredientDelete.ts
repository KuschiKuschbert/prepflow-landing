'use client';

import { supabase } from '@/lib/supabase';
import { useCallback } from 'react';

interface Ingredient {
  id: string;
}

interface UseIngredientDeleteProps {
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setError: (error: string) => void;
}

export function useIngredientDelete({ setIngredients, setError }: UseIngredientDeleteProps) {
  const handleDeleteIngredient = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from('ingredients').delete().eq('id', id);

        if (error) {
          if (error.code === '42501' || error.message?.includes('row-level security')) {
            console.warn('RLS policy blocked direct delete, falling back to API route');
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

