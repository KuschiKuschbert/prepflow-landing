'use client';

import { supabase } from '@/lib/supabase';
import {
  formatBrandName,
  formatIngredientName,
  formatStorageLocation,
  formatSupplierName,
  formatTextInput,
} from '@/lib/text-utils';
import { useCallback } from 'react';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  supplier?: string;
  storage_location?: string;
}

interface UseIngredientUpdateProps {
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setError: (error: string) => void;
  setEditingIngredient?: (ingredient: Ingredient | null) => void;
}

export function useIngredientUpdate({
  setIngredients,
  setError,
  setEditingIngredient,
}: UseIngredientUpdateProps) {
  const handleUpdateIngredient = useCallback(
    async (id: string, updates: Partial<Ingredient>) => {
      try {
        const formattedUpdates = {
          ...updates,
          ingredient_name: updates.ingredient_name ? formatIngredientName(updates.ingredient_name) : undefined,
          brand: updates.brand ? formatBrandName(updates.brand) : undefined,
          supplier: updates.supplier ? formatSupplierName(updates.supplier) : undefined,
          storage_location: updates.storage_location ? formatStorageLocation(updates.storage_location) : undefined,
          product_code: updates.product_code ? formatTextInput(updates.product_code) : undefined,
        };

        const { data, error } = await supabase
          .from('ingredients')
          .update(formattedUpdates)
          .eq('id', id)
          .select();

        if (error) {
          if (error.code === '42501' || error.message?.includes('row-level security')) {
            console.warn('RLS policy blocked direct update, falling back to API route');
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
        setError('Failed to update ingredient');
      }
    },
    [setIngredients, setError, setEditingIngredient],
  );

  return { handleUpdateIngredient };
}

