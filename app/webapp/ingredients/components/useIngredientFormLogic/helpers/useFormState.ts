/**
 * Hook for managing ingredient form state.
 */

import { useEffect, useState } from 'react';

import { Ingredient } from '../../types';

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
