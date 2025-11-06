// PrepFlow - Ingredient Form Logic Hook
// Extracted from IngredientForm.tsx to meet file size limits

'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatTextInput } from '@/lib/text-utils';
import { convertUnit } from '@/lib/unit-conversion';

interface Ingredient {
  id?: string;
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
}

interface UseIngredientFormLogicProps {
  ingredient?: Ingredient | null;
  onSave: (ingredient: Partial<Ingredient>) => Promise<void>;
}

export function useIngredientFormLogic({ ingredient, onSave }: UseIngredientFormLogicProps) {
  const [formData, setFormData] = useState<Partial<Ingredient>>({
    ingredient_name: '',
    brand: '',
    pack_size: '',
    pack_size_unit: 'GM',
    pack_price: 0,
    unit: 'GM',
    cost_per_unit: 0,
    cost_per_unit_as_purchased: 0,
    cost_per_unit_incl_trim: 0,
    trim_peel_waste_percentage: 0,
    yield_percentage: 100,
    supplier: '',
    product_code: '',
    storage_location: '',
    min_stock_level: 0,
    current_stock: 0,
    ...ingredient,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (ingredient) {
      setFormData({
        ingredient_name: ingredient.ingredient_name || '',
        brand: ingredient.brand || '',
        pack_size: ingredient.pack_size || '',
        pack_size_unit: ingredient.pack_size_unit || 'GM',
        pack_price: ingredient.pack_price || 0,
        unit: ingredient.unit || 'GM',
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
        min_stock_level: ingredient.min_stock_level || 0,
        current_stock: ingredient.current_stock || 0,
      });
    } else {
      setFormData({
        ingredient_name: '',
        brand: '',
        pack_size: '',
        pack_size_unit: 'GM',
        pack_price: 0,
        unit: 'GM',
        cost_per_unit: 0,
        cost_per_unit_as_purchased: 0,
        cost_per_unit_incl_trim: 0,
        trim_peel_waste_percentage: 0,
        yield_percentage: 100,
        supplier: '',
        product_code: '',
        storage_location: '',
        min_stock_level: 0,
        current_stock: 0,
      });
    }
    setErrors({});
  }, [ingredient]);

  const calculateCostPerUnit = useCallback(
    (packPrice: number, packSize: number, packSizeUnit: string, targetUnit: string): number => {
      if (packPrice === 0 || packSize === 0) return 0;
      const conversion = convertUnit(1, packSizeUnit, targetUnit);
      const packSizeInTargetUnit = packSize * conversion.value;
      return packPrice / packSizeInTargetUnit;
    },
    [],
  );

  const updateCostPerUnit = useCallback(() => {
    if (formData.pack_price && formData.pack_size && formData.pack_size_unit && formData.unit) {
      const calculatedCost = calculateCostPerUnit(
        formData.pack_price,
        parseFloat(formData.pack_size),
        formData.pack_size_unit,
        formData.unit,
      );
      setFormData(prev => ({
        ...prev,
        cost_per_unit: calculatedCost,
        cost_per_unit_as_purchased: calculatedCost,
        cost_per_unit_incl_trim: calculatedCost,
      }));
    }
  }, [
    formData.pack_price,
    formData.pack_size,
    formData.pack_size_unit,
    formData.unit,
    calculateCostPerUnit,
  ]);

  const handleInputChange = useCallback(
    (field: keyof Ingredient, value: string | number) => {
      const formattedValue = typeof value === 'string' ? formatTextInput(value) : value;
      setFormData(prev => ({
        ...prev,
        [field]: formattedValue,
      }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
      if (['pack_price', 'pack_size', 'pack_size_unit', 'unit'].includes(field)) {
        setTimeout(updateCostPerUnit, 100);
      }
    },
    [errors, updateCostPerUnit],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.ingredient_name?.trim()) {
      newErrors.ingredient_name = 'Ingredient name is required';
    }
    if (!formData.pack_price || formData.pack_price <= 0) {
      newErrors.pack_price = 'Pack price must be greater than 0';
    }
    if (!formData.pack_size || parseFloat(formData.pack_size) <= 0) {
      newErrors.pack_size = 'Pack size must be greater than 0';
    }
    if (!formData.unit) {
      newErrors.unit = 'Unit is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        const qs = new URLSearchParams({
          ingredient_name: (formData.ingredient_name || '').toString().toLowerCase(),
          supplier: (formData.supplier || '').toString(),
          brand: (formData.brand || '').toString(),
          pack_size: (formData.pack_size || '').toString(),
          unit: (formData.unit || '').toString(),
          cost_per_unit: String(formData.cost_per_unit || 0),
        }).toString();
        const existsRes = await fetch(`/api/ingredients/exists?${qs}`, { cache: 'no-store' });
        const existsJson = await existsRes.json();
        if (existsJson?.exists) {
          setErrors(prev => ({ ...prev, ingredient_name: 'This ingredient already exists' }));
          return;
        }
        await onSave(formData);
      } catch (error) {
        console.error('Error saving ingredient:', error);
      }
    },
    [formData, validateForm, onSave],
  );

  return {
    formData,
    errors,
    handleInputChange,
    validateForm,
    handleSubmit,
  };
}
