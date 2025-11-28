/**
 * Hook for managing ingredient form state.
 */

import { useEffect, useState } from 'react';

interface Ingredient {
  id?: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  category?: string;
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
}

export function useFormState(ingredient?: Ingredient | null) {
  const [formData, setFormData] = useState<Partial<Ingredient>>({
    ingredient_name: '',
    brand: '',
    pack_size: '',
    pack_size_unit: 'GM',
    pack_price: 0,
    category: '',
    unit: 'GM',
    cost_per_unit: 0,
    cost_per_unit_as_purchased: 0,
    cost_per_unit_incl_trim: 0,
    trim_peel_waste_percentage: 0,
    yield_percentage: 100,
    supplier: '',
    product_code: '',
    storage_location: '',
    ...ingredient,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (ingredient) {
      const packSizeUnit = ingredient.pack_size_unit || 'GM';
      setFormData({
        ingredient_name: ingredient.ingredient_name || '',
        brand: ingredient.brand || '',
        pack_size: ingredient.pack_size || '',
        pack_size_unit: packSizeUnit,
        pack_price: ingredient.pack_price || 0,
        category: ingredient.category || '',
        unit: ingredient.unit || packSizeUnit,
        cost_per_unit: ingredient.cost_per_unit || 0,
        cost_per_unit_as_purchased:
          ingredient.cost_per_unit_as_purchased || ingredient.cost_per_unit || 0,
        cost_per_unit_incl_trim:
          ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0,
        trim_peel_waste_percentage: ingredient.trim_peel_waste_percentage || 0,
        yield_percentage: ingredient.yield_percentage || 100,
        supplier: ingredient.supplier || '',
        product_code: ingredient.product_code || '',
        storage_location: ingredient.storage_location || '',
      });
    } else {
      setFormData({
        ingredient_name: '',
        brand: '',
        pack_size: '',
        pack_size_unit: 'GM',
        pack_price: 0,
        category: '',
        unit: 'GM',
        cost_per_unit: 0,
        cost_per_unit_as_purchased: 0,
        cost_per_unit_incl_trim: 0,
        trim_peel_waste_percentage: 0,
        yield_percentage: 100,
        supplier: '',
        product_code: '',
        storage_location: '',
      });
    }
    setErrors({});
  }, [ingredient]);

  return { formData, setFormData, errors, setErrors };
}
