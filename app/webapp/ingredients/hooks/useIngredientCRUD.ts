'use client';

import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  formatIngredientName,
  formatBrandName,
  formatSupplierName,
  formatStorageLocation,
  formatTextInput,
} from '@/lib/text-utils';
import { normalizeIngredientData } from '@/lib/ingredients/normalizeIngredientDataMain';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
  created_at?: string;
  updated_at?: string;
}

interface UseIngredientCRUDProps {
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setError: (error: string) => void;
  setShowAddForm?: (show: boolean) => void;
  setWizardStep?: (step: number) => void;
  setNewIngredient?: (ingredient: Partial<Ingredient>) => void;
  setEditingIngredient?: (ingredient: Ingredient | null) => void;
}

const DEFAULT_INGREDIENT = {
  ingredient_name: '',
  brand: '',
  pack_size: '',
  pack_size_unit: 'g',
  pack_price: 0,
  unit: 'g',
  cost_per_unit: 0,
  supplier: '',
  product_code: '',
  storage_location: '',
  min_stock_level: 0,
  current_stock: 0,
};

export function useIngredientCRUD({
  setIngredients,
  setError,
  setShowAddForm,
  setWizardStep,
  setNewIngredient,
  setEditingIngredient,
}: UseIngredientCRUDProps) {
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
          console.error('Supabase error inserting ingredient:', error);
          throw error;
        }
        setIngredients(prev => [...prev, ...(data || [])]);
        if (setShowAddForm) setShowAddForm(false);
        if (setWizardStep) setWizardStep(1);
        if (setNewIngredient) setNewIngredient(DEFAULT_INGREDIENT);
      } catch (error: any) {
        const msg =
          error?.message ||
          (error?.code
            ? `Database error (${error.code})${error?.details ? `: ${error.details}` : ''}${error?.hint ? ` Hint: ${error.hint}` : ''}`
            : error?.details || 'Failed to add ingredient');
        setError(`Failed to add ingredient: ${msg}`);
        throw error;
      }
    },
    [setIngredients, setError, setShowAddForm, setWizardStep, setNewIngredient],
  );
  const handleUpdateIngredient = useCallback(
    async (id: string, updates: Partial<Ingredient>) => {
      try {
        const { data, error } = await supabase
          .from('ingredients')
          .update({
            ...updates,
            ingredient_name: updates.ingredient_name
              ? formatIngredientName(updates.ingredient_name)
              : undefined,
            brand: updates.brand ? formatBrandName(updates.brand) : undefined,
            supplier: updates.supplier ? formatSupplierName(updates.supplier) : undefined,
            storage_location: updates.storage_location
              ? formatStorageLocation(updates.storage_location)
              : undefined,
            product_code: updates.product_code ? formatTextInput(updates.product_code) : undefined,
          })
          .eq('id', id)
          .select();
        if (error) throw error;
        setIngredients(prev => prev.map(ing => (ing.id === id ? { ...ing, ...updates } : ing)));
        if (setEditingIngredient) setEditingIngredient(null);
      } catch (error) {
        setError('Failed to update ingredient');
      }
    },
    [setIngredients, setError, setEditingIngredient],
  );
  const handleDeleteIngredient = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from('ingredients').delete().eq('id', id);
        if (error) throw error;
        setIngredients(prev => prev.filter(ing => ing.id !== id));
      } catch (error) {
        setError('Failed to delete ingredient');
      }
    },
    [setIngredients, setError],
  );
  return { handleAddIngredient, handleUpdateIngredient, handleDeleteIngredient };
}
