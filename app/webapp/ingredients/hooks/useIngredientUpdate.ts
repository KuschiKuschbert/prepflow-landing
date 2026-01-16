'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { useCallback } from 'react';
import { formatIngredientUpdates } from './helpers/formatIngredientUpdates';

interface UseIngredientUpdateProps<
  T extends { id: string; ingredient_name: string; cost_per_unit: number },
> {
  setIngredients: React.Dispatch<React.SetStateAction<T[]>>;
  setError: (error: string) => void;
  setEditingIngredient?: (ingredient: T | null) => void;
}

export function useIngredientUpdate<
  T extends { id: string; ingredient_name: string; cost_per_unit: number },
>({ setIngredients, setError, setEditingIngredient }: UseIngredientUpdateProps<T>) {
  const { showSuccess } = useNotification();
  const handleUpdateIngredient = useCallback(
    async (id: string, updates: Partial<T>) => {
      // Store original state for rollback
      let originalIngredients: T[] = [];
      setIngredients(prev => {
        originalIngredients = [...prev];
        return prev;
      });

      const formattedUpdates = formatIngredientUpdates(updates);

      // Optimistically update UI immediately
      setIngredients(prev =>
        prev.map(ing => (ing.id === id ? { ...ing, ...formattedUpdates } : ing)),
      );

      try {
        const { data, error } = await supabase
          .from('ingredients')
          .update(formattedUpdates)
          .eq('id', id)
          .select();

        if (error) {
          if (error.code === '42501' || error.message?.includes('row-level security')) {
            logger.warn('RLS policy blocked direct update, falling back to API route');
            const response = await fetch('/api/ingredients', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, ...updates }),
            });

            const result = (await response.json()) as { success?: boolean; data?: T };
            if (!response.ok || !result.success) {
              // Revert optimistic update on error
              setIngredients(originalIngredients);
              setError('Ingredient not found. It may have been deleted.');
              if (setEditingIngredient) setEditingIngredient(null);
              return;
            }

            const serverData = result.data;
            if (!serverData) {
              setIngredients(originalIngredients);
              setError('Failed to receive updated data from server');
              return;
            }

            // Replace optimistic update with server response
            setIngredients(prev => prev.map(ing => (ing.id === id ? serverData : ing)));
            if (setEditingIngredient) setEditingIngredient(null);
            showSuccess('Ingredient updated successfully');
            return;
          } else {
            // Revert optimistic update on error
            setIngredients(originalIngredients);
            throw error;
          }
        }

        if (!data || data.length === 0) {
          // Revert optimistic update on error
          setIngredients(originalIngredients);
          setError('Ingredient not found. It may have been deleted.');
          if (setEditingIngredient) setEditingIngredient(null);
          return;
        }

        // Replace optimistic update with server response
        setIngredients(prev => prev.map(ing => (ing.id === id ? data[0] : ing)));
        if (setEditingIngredient) setEditingIngredient(null);
        showSuccess('Ingredient updated successfully');
      } catch (error) {
        // Revert optimistic update on error
        setIngredients(originalIngredients);
        logger.error('[useIngredientUpdate.ts] Error in catch block:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        setError('Failed to update ingredient');
      }
    },
    [setIngredients, setError, setEditingIngredient, showSuccess],
  );
  return { handleUpdateIngredient };
}
