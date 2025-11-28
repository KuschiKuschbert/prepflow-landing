/**
 * Hook for form validation logic.
 */

import { useCallback } from 'react';

interface FormData {
  ingredient_name?: string;
  pack_price?: number;
  pack_size?: string;
  pack_size_unit?: string;
}

export function useFormValidation(formData: FormData) {
  const validateForm = useCallback((): { isValid: boolean; errors: Record<string, string> } => {
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
    if (!formData.pack_size_unit) {
      newErrors.pack_size_unit = 'Pack size unit is required';
    }
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  }, [formData]);

  return { validateForm };
}
