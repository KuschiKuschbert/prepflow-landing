'use client';

import { normalizeIngredientData } from '@/lib/ingredients/normalizeIngredientDataMain';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
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
  min_stock_level?: number;
  current_stock?: number;
}

interface UseIngredientAddProps {
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setError: (error: string) => void;
  setShowAddForm?: (show: boolean) => void;
  setWizardStep?: (step: number) => void;
  setNewIngredient?: (ingredient: Partial<Ingredient>) => void;
}

const DEFAULT_INGREDIENT = { ingredient_name: '', brand: '', pack_size: '', pack_size_unit: 'g', pack_price: 0, unit: 'g', cost_per_unit: 0, supplier: '', product_code: '', storage_location: '', min_stock_level: 0, current_stock: 0 };

export function useIngredientAdd({
  setIngredients,
  setError,
  setShowAddForm,
  setWizardStep,
  setNewIngredient,
}: UseIngredientAddProps) {
  const queryClient = useQueryClient();

  const handleAddIngredient = useCallback(
    async (ingredientData: Partial<Ingredient>) => {
      try {
        const { normalized, error: normalizeError } = normalizeIngredientData(ingredientData);
        if (normalizeError) {
          setError(normalizeError);
          throw new Error(normalizeError);
        }

        const { data, error } = await supabase.from('ingredients').insert([normalized]).select();

        if (error) {
          if (error.code === '42501' || error.message?.includes('row-level security')) {
            console.warn('RLS policy blocked direct insert, falling back to API route');
            const response = await fetch('/api/ingredients', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(ingredientData),
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
              const errorMsg = result.details || result.error || 'Failed to add ingredient';
              setError(`Failed to add ingredient: ${errorMsg}`);
              throw new Error(errorMsg);
            }

            if (result.data) {
              setIngredients(prev => [...prev, result.data]);
            }
          } else {
            console.error('Supabase error inserting ingredient:', error);
            throw error;
          }
        } else {
          setIngredients(prev => [...prev, ...(data || [])]);
        }

        await queryClient.invalidateQueries({ queryKey: ['ingredients'] });
        if (setShowAddForm) setShowAddForm(false);
        if (setWizardStep) setWizardStep(1);
        if (setNewIngredient) setNewIngredient(DEFAULT_INGREDIENT);
      } catch (error: any) {
        const msg = error?.message || (error?.code ? `Database error (${error.code})${error?.details ? `: ${error.details}` : ''}${error?.hint ? ` Hint: ${error.hint}` : ''}` : error?.details || 'Failed to add ingredient');
        setError(`Failed to add ingredient: ${msg}`);
        throw error;
      }
    },
    [setIngredients, setError, setShowAddForm, setWizardStep, setNewIngredient, queryClient],
  );

  return { handleAddIngredient };
}

