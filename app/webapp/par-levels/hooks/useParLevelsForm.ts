/**
 * Hook for managing par level form state and submission.
 */

import { useState, useCallback } from 'react';
import type { ParLevel, Ingredient } from '../types';
import { submitParLevelForm as submitParLevelFormHelper } from './useParLevelsForm/formSubmission';

interface UseParLevelsFormProps {
  parLevels: ParLevel[];
  ingredients: Ingredient[];
  setParLevels: React.Dispatch<React.SetStateAction<ParLevel[]>>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

interface FormData {
  ingredientId: string;
  parLevel: string;
  reorderPointPercentage: string;
  unit: string;
}

/**
 * Hook for managing par level form state and submission.
 *
 * @param {UseParLevelsFormProps} props - Hook dependencies
 * @returns {Object} Form state and handlers
 */
export function useParLevelsForm({
  parLevels,
  ingredients,
  setParLevels,
  showError,
  showSuccess,
}: UseParLevelsFormProps) {
  const [formData, setFormData] = useState<FormData>({
    ingredientId: '',
    parLevel: '',
    reorderPointPercentage: '50', // Default to 50%
    unit: '',
  });

  const resetForm = useCallback(() => {
    setFormData({
      ingredientId: '',
      parLevel: '',
      reorderPointPercentage: '50', // Default to 50%
      unit: '',
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await submitParLevelFormHelper({
        formData,
        ingredients,
        parLevels,
        setParLevels,
        showError,
        showSuccess,
        resetForm,
      });
    },
    [formData, ingredients, parLevels, setParLevels, showError, showSuccess, resetForm],
  );

  return {
    formData,
    setFormData,
    handleSubmit,
    resetForm,
  };
}
