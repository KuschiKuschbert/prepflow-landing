'use client';

import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import {
  formatBrandName,
  formatIngredientName,
  formatStorageLocation,
  formatSupplierName,
  formatTextInput,
} from '@/lib/text-utils';
import { useCallback } from 'react';

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
  const handleUpdateIngredient = useCallback(
    async (id: string, updates: Partial<T>) => {
      try {
        const formattedUpdates = {
          ...updates,
          ingredient_name:
            'ingredient_name' in updates && updates.ingredient_name
              ? formatIngredientName(String(updates.ingredient_name))
              : undefined,
          brand:
            'brand' in updates && updates.brand
              ? formatBrandName(String(updates.brand))
              : undefined,
          supplier:
            'supplier' in updates && updates.supplier
              ? formatSupplierName(String(updates.supplier))
              : undefined,
          storage_location:
            'storage_location' in updates && updates.storage_location
              ? formatStorageLocation(String(updates.storage_location))
              : undefined,
          product_code:
            'product_code' in updates && updates.product_code
              ? formatTextInput(String(updates.product_code))
              : undefined,
        };

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

            const result = await response.json();
            if (!response.ok || !result.success) {
              setError('Ingredient not found. It may have been deleted.');
              if (setEditingIngredient) setEditingIngredient(null);
              setIngredients(prev => prev.filter(ing => ing.id !== id));
              return;
            }

            setIngredients(prev => prev.map(ing => (ing.id === id ? result.data : ing)));
            if (setEditingIngredient) setEditingIngredient(null);
            return;
          } else {
            throw error;
          }
        }

        if (!data || data.length === 0) {
          setError('Ingredient not found. It may have been deleted.');
          if (setEditingIngredient) setEditingIngredient(null);
          setIngredients(prev => prev.filter(ing => ing.id !== id));
          return;
        }

        setIngredients(prev => prev.map(ing => (ing.id === id ? data[0] : ing)));
        if (setEditingIngredient) setEditingIngredient(null);
      } catch (error) {
        logger.error('[useIngredientUpdate.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

        setError('Failed to update ingredient');
      }
    },
    [setIngredients, setError, setEditingIngredient],
  );
  return { handleUpdateIngredient };
}
