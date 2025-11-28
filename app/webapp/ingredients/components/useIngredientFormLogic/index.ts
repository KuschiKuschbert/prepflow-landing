// PrepFlow - Ingredient Form Logic Hook
// Extracted from IngredientForm.tsx to meet file size limits

'use client';

import { formatTextInput } from '@/lib/text-utils';
import { useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { useFormState } from './helpers/useFormState';
import { useCostCalculation } from './helpers/useCostCalculation';
import { useCategoryDetection } from './helpers/useCategoryDetection';
import { useFormValidation } from './helpers/useFormValidation';
import type { Ingredient, UseIngredientFormLogicProps } from './types';

export function useIngredientFormLogic({ ingredient, onSave }: UseIngredientFormLogicProps) {
  const { formData, setFormData, errors, setErrors } = useFormState(ingredient);
  const { updateCostPerUnit } = useCostCalculation(formData, setFormData);
  const {
    autoDetectedCategory,
    handleCategoryDetection,
    clearAutoDetectedCategory,
    setAutoDetectedCategory,
  } = useCategoryDetection(formData);
  const { validateForm } = useFormValidation(formData);

  // Reset auto-detected category when ingredient changes
  useEffect(() => {
    setAutoDetectedCategory(null);
  }, [ingredient, setAutoDetectedCategory]);

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

      // Recalculate cost when pack_price, pack_size, or pack_size_unit changes
      if (['pack_price', 'pack_size', 'pack_size_unit'].includes(field)) {
        setTimeout(updateCostPerUnit, 100);
      }

      // Auto-detect category when ingredient_name changes (debounced)
      if (field === 'ingredient_name' && typeof formattedValue === 'string') {
        handleCategoryDetection(formattedValue, setFormData);
      }

      // Clear auto-detected indicator if user manually changes category
      if (field === 'category') {
        clearAutoDetectedCategory();
      }
    },
    [
      errors,
      updateCostPerUnit,
      handleCategoryDetection,
      clearAutoDetectedCategory,
      setFormData,
      setErrors,
    ],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const { isValid, errors: validationErrors } = validateForm();
      if (!isValid) {
        setErrors(validationErrors);
        return;
      }

      try {
        const unit = formData.pack_size_unit || formData.unit || 'GM';
        const qs = new URLSearchParams({
          ingredient_name: (formData.ingredient_name || '').toString().toLowerCase(),
          supplier: (formData.supplier || '').toString(),
          brand: (formData.brand || '').toString(),
          pack_size: (formData.pack_size || '').toString(),
          unit: unit.toString(),
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
        logger.error('Error saving ingredient:', error);
      }
    },
    [formData, validateForm, onSave, setErrors],
  );

  return {
    formData,
    errors,
    handleInputChange,
    validateForm: () => validateForm().isValid,
    handleSubmit,
    autoDetectedCategory,
  };
}
