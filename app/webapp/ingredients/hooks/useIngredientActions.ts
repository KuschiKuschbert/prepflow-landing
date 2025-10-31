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

interface UseIngredientActionsProps {
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setError: (error: string) => void;
  setShowAddForm?: (show: boolean) => void;
  setWizardStep?: (step: number) => void;
  setNewIngredient?: (ingredient: Partial<Ingredient>) => void;
  setEditingIngredient?: (ingredient: Ingredient | null) => void;
  setShowCSVImport?: (show: boolean) => void;
  setCsvData?: (data: string) => void;
  setParsedIngredients?: (ingredients: Partial<Ingredient>[]) => void;
  setSelectedIngredients?: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedIngredients?: Set<string>;
  filteredIngredients?: Ingredient[];
}

export function useIngredientActions({
  setIngredients,
  setError,
  setShowAddForm,
  setWizardStep,
  setNewIngredient,
  setEditingIngredient,
  setShowCSVImport,
  setCsvData,
  setParsedIngredients,
  setSelectedIngredients,
  selectedIngredients,
  filteredIngredients,
}: UseIngredientActionsProps) {
  const handleAddIngredient = useCallback(
    async (ingredientData: Partial<Ingredient>) => {
      try {
        const { data, error } = await supabase
          .from('ingredients')
          .insert([
            {
              ...ingredientData,
              ingredient_name: formatIngredientName(ingredientData.ingredient_name || ''),
              brand: ingredientData.brand ? formatBrandName(ingredientData.brand) : null,
              supplier: ingredientData.supplier
                ? formatSupplierName(ingredientData.supplier)
                : null,
              storage_location: ingredientData.storage_location
                ? formatStorageLocation(ingredientData.storage_location)
                : null,
              product_code: ingredientData.product_code
                ? formatTextInput(ingredientData.product_code)
                : null,
            },
          ])
          .select();

        if (error) throw error;
        setIngredients(prev => [...prev, ...(data || [])]);
        if (setShowAddForm) setShowAddForm(false);
        if (setWizardStep) setWizardStep(1);
        if (setNewIngredient) {
          setNewIngredient({
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
          });
        }
      } catch (error) {
        setError('Failed to add ingredient');
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

  const handleBulkDelete = useCallback(async () => {
    if (!selectedIngredients || selectedIngredients.size === 0) return;
    try {
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .in('id', Array.from(selectedIngredients));

      if (error) throw error;
      setIngredients(prev => prev.filter(ing => !selectedIngredients.has(ing.id)));
      if (setSelectedIngredients) setSelectedIngredients(new Set());
    } catch (error) {
      setError('Failed to delete selected ingredients');
    }
  }, [selectedIngredients, setIngredients, setError, setSelectedIngredients]);

  const exportToCSV = useCallback(() => {
    if (!filteredIngredients) return;

    const csvContent = [
      [
        'Ingredient Name',
        'Brand',
        'Pack Size',
        'Pack Size Unit',
        'Pack Price',
        'Unit',
        'Cost Per Unit',
        'Supplier',
        'Product Code',
        'Storage Location',
        'Min Stock Level',
        'Current Stock',
      ].join(','),
      ...filteredIngredients.map(ingredient =>
        [
          ingredient.ingredient_name,
          ingredient.brand || '',
          ingredient.pack_size || '',
          ingredient.pack_size_unit || '',
          ingredient.pack_price || 0,
          ingredient.unit || '',
          ingredient.cost_per_unit || 0,
          ingredient.supplier || '',
          ingredient.product_code || '',
          ingredient.storage_location || '',
          ingredient.min_stock_level || 0,
          ingredient.current_stock || 0,
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ingredients.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filteredIngredients]);

  const handleCSVImport = useCallback(
    async (parsedIngredients: Partial<Ingredient>[]) => {
      try {
        const { data, error } = await supabase
          .from('ingredients')
          .insert(
            parsedIngredients.map(ingredient => ({
              ...ingredient,
              ingredient_name: formatIngredientName(ingredient.ingredient_name || ''),
              brand: ingredient.brand ? formatBrandName(ingredient.brand) : null,
              supplier: ingredient.supplier ? formatSupplierName(ingredient.supplier) : null,
              storage_location: ingredient.storage_location
                ? formatStorageLocation(ingredient.storage_location)
                : null,
              product_code: ingredient.product_code
                ? formatTextInput(ingredient.product_code)
                : null,
            })),
          )
          .select();

        if (error) throw error;
        setIngredients(prev => [...prev, ...(data || [])]);
        if (setShowCSVImport) setShowCSVImport(false);
        if (setCsvData) setCsvData('');
        if (setParsedIngredients) setParsedIngredients([]);
        return true;
      } catch (error) {
        setError('Failed to import ingredients');
        return false;
      }
    },
    [setIngredients, setError, setShowCSVImport, setCsvData, setParsedIngredients],
  );

  const handleSelectIngredient = useCallback(
    (id: string, selected: boolean) => {
      if (!setSelectedIngredients) return;
      const newSelected = new Set(selectedIngredients || new Set());
      if (selected) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      setSelectedIngredients(newSelected);
    },
    [selectedIngredients, setSelectedIngredients],
  );

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (!setSelectedIngredients || !filteredIngredients) return;
      if (selected) {
        setSelectedIngredients(new Set(filteredIngredients.map(ing => ing.id)));
      } else {
        setSelectedIngredients(new Set());
      }
    },
    [filteredIngredients, setSelectedIngredients],
  );

  return {
    handleAddIngredient,
    handleUpdateIngredient,
    handleDeleteIngredient,
    handleBulkDelete,
    exportToCSV,
    handleCSVImport,
    handleSelectIngredient,
    handleSelectAll,
  };
}
