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
import { convertUnit, isVolumeUnit, isWeightUnit } from '@/lib/unit-conversion';

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
        // Validate required fields
        if (!ingredientData.ingredient_name?.trim()) {
          const errorMsg = 'Ingredient name is required';
          setError(errorMsg);
          throw new Error(errorMsg);
        }
        if (!ingredientData.unit) {
          const errorMsg = 'Unit is required';
          setError(errorMsg);
          throw new Error(errorMsg);
        }
        // Cost per unit can be 0 if it will be calculated, but we need pack_price and pack_size
        if (!ingredientData.cost_per_unit && (!ingredientData.pack_price || !ingredientData.pack_size)) {
          const errorMsg = 'Either cost per unit or pack price and pack size are required';
          setError(errorMsg);
          throw new Error(errorMsg);
        }

        // If cost_per_unit is 0, calculate it from pack_price and pack_size
        let costPerUnit = ingredientData.cost_per_unit || 0;
        if (costPerUnit === 0 && ingredientData.pack_price && ingredientData.pack_size && ingredientData.unit) {
          const packSizeFloat = parseFloat(String(ingredientData.pack_size));
          const packPriceFloat = parseFloat(String(ingredientData.pack_price));
          if (packSizeFloat > 0 && packPriceFloat > 0) {
            costPerUnit = packPriceFloat / packSizeFloat;
            console.log('Calculated cost_per_unit from pack_price and pack_size:', costPerUnit);
          }
        }

        if (costPerUnit <= 0) {
          const errorMsg = 'Cost per unit must be greater than 0';
          setError(errorMsg);
          throw new Error(errorMsg);
        }

        // Convert string fields to proper types
        const packSize =
          typeof ingredientData.pack_size === 'string'
            ? parseFloat(ingredientData.pack_size) || null
            : ingredientData.pack_size || null;

        const packPrice =
          typeof ingredientData.pack_price === 'string'
            ? parseFloat(String(ingredientData.pack_price)) || 0
            : ingredientData.pack_price || 0;

        // Use calculated costPerUnit if it was calculated above, otherwise parse from data
        // (costPerUnit was already calculated/validated above)

        const costPerUnitAsPurchased =
          typeof ingredientData.cost_per_unit_as_purchased === 'string'
            ? parseFloat(String(ingredientData.cost_per_unit_as_purchased)) || costPerUnit
            : ingredientData.cost_per_unit_as_purchased || costPerUnit;

        const costPerUnitInclTrim =
          typeof ingredientData.cost_per_unit_incl_trim === 'string'
            ? parseFloat(String(ingredientData.cost_per_unit_incl_trim)) || costPerUnit
            : ingredientData.cost_per_unit_incl_trim || costPerUnit;

        const trimPeelWastePercentage =
          typeof ingredientData.trim_peel_waste_percentage === 'string'
            ? parseFloat(String(ingredientData.trim_peel_waste_percentage)) || 0
            : ingredientData.trim_peel_waste_percentage || 0;

        const yieldPercentage =
          typeof ingredientData.yield_percentage === 'string'
            ? parseFloat(String(ingredientData.yield_percentage)) || 100
            : ingredientData.yield_percentage || 100;

        const minStockLevel =
          typeof ingredientData.min_stock_level === 'string'
            ? parseInt(String(ingredientData.min_stock_level), 10) || 0
            : ingredientData.min_stock_level || 0;

        const currentStock =
          typeof ingredientData.current_stock === 'string'
            ? parseInt(String(ingredientData.current_stock), 10) || 0
            : ingredientData.current_stock || 0;

        // Normalize unit to base units (GM for weight, ML for volume)
        const inputUnit = ingredientData.unit || 'g';
        let normalizedUnit = inputUnit.toUpperCase();
        let normalizedCostPerUnit = costPerUnit;
        let normalizedCostPerUnitAsPurchased = costPerUnitAsPurchased;
        let normalizedCostPerUnitInclTrim = costPerUnitInclTrim;

        // Convert to base units: GM for weight, ML for volume
        if (isWeightUnit(inputUnit.toLowerCase()) && normalizedUnit !== 'GM') {
          // Convert to GM (grams)
          const conversion = convertUnit(1, inputUnit.toLowerCase(), 'g');
          normalizedUnit = 'GM';
          normalizedCostPerUnit = costPerUnit / conversion.value;
          normalizedCostPerUnitAsPurchased = costPerUnitAsPurchased / conversion.value;
          normalizedCostPerUnitInclTrim = costPerUnitInclTrim / conversion.value;
          console.log(
            `Normalized weight unit from ${inputUnit} to GM: cost ${costPerUnit} -> ${normalizedCostPerUnit}`,
          );
        } else if (isVolumeUnit(inputUnit.toLowerCase()) && normalizedUnit !== 'ML') {
          // Convert to ML (milliliters)
          const conversion = convertUnit(1, inputUnit.toLowerCase(), 'ml');
          normalizedUnit = 'ML';
          normalizedCostPerUnit = costPerUnit / conversion.value;
          normalizedCostPerUnitAsPurchased = costPerUnitAsPurchased / conversion.value;
          normalizedCostPerUnitInclTrim = costPerUnitInclTrim / conversion.value;
          console.log(
            `Normalized volume unit from ${inputUnit} to ML: cost ${costPerUnit} -> ${normalizedCostPerUnit}`,
          );
        }

        // Prepare data for insert - ensure all required fields are present
        const insertData: any = {
          ingredient_name: formatIngredientName(ingredientData.ingredient_name.trim()),
          unit: normalizedUnit,
          cost_per_unit: normalizedCostPerUnit,
        };

        // Add optional fields only if they have values
        if (normalizedCostPerUnitAsPurchased !== costPerUnit) {
          insertData.cost_per_unit_as_purchased = normalizedCostPerUnitAsPurchased;
        }
        if (normalizedCostPerUnitInclTrim !== costPerUnit) {
          insertData.cost_per_unit_incl_trim = normalizedCostPerUnitInclTrim;
        }
        if (trimPeelWastePercentage > 0) {
          insertData.trim_peel_waste_percentage = trimPeelWastePercentage;
        }
        if (yieldPercentage !== 100) {
          insertData.yield_percentage = yieldPercentage;
        }
        if (packSize !== null && packSize > 0) {
          insertData.pack_size = packSize;
        }
        if (ingredientData.pack_size_unit) {
          insertData.pack_size_unit = ingredientData.pack_size_unit;
        }
        if (packPrice > 0) {
          insertData.pack_price = packPrice;
        }
        if (ingredientData.brand) {
          insertData.brand = formatBrandName(ingredientData.brand);
        }
        if (ingredientData.supplier) {
          insertData.supplier = formatSupplierName(ingredientData.supplier);
        }
        if (ingredientData.storage_location) {
          insertData.storage_location = formatStorageLocation(ingredientData.storage_location);
        }
        if (ingredientData.product_code) {
          insertData.product_code = formatTextInput(ingredientData.product_code);
        }
        if (minStockLevel > 0) {
          insertData.min_stock_level = minStockLevel;
        }
        if (currentStock > 0) {
          insertData.current_stock = currentStock;
        }

        console.log('Inserting ingredient:', insertData);
        console.log('Insert data validation:', {
          hasIngredientName: !!insertData.ingredient_name,
          hasUnit: !!insertData.unit,
          hasCostPerUnit: insertData.cost_per_unit > 0,
          packSize: insertData.pack_size,
          packPrice: insertData.pack_price,
          normalizedUnit: insertData.unit,
        });

        const { data, error } = await supabase.from('ingredients').insert([insertData]).select();

        if (error) {
          console.error('Supabase error inserting ingredient:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
            fullError: JSON.stringify(error, null, 2),
          });
          throw error;
        }

        console.log('Ingredient inserted successfully:', data);
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
      } catch (error: any) {
        console.error('Error in handleAddIngredient:', {
          error,
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
          stack: error?.stack,
          ingredientData: ingredientData,
        });

        // Provide more detailed error messages
        let errorMessage = 'Failed to add ingredient';
        if (error?.message) {
          errorMessage = error.message;
        } else if (error?.code) {
          errorMessage = `Database error (${error.code})`;
          if (error?.details) {
            errorMessage += `: ${error.details}`;
          }
          if (error?.hint) {
            errorMessage += ` Hint: ${error.hint}`;
          }
        } else if (error?.details) {
          errorMessage = error.details;
        }

        setError(`Failed to add ingredient: ${errorMessage}`);
        throw error; // Re-throw to allow wizard to handle it
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
      const newSelected = new Set<string>(selectedIngredients || new Set<string>());
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
