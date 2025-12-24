interface FormData {
  ingredientId: string;
  parLevel: string;
  reorderPointPercentage: string;
  unit: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  parLevelValue?: number;
  reorderPointValue?: number;
}

export function validateFormData(
  formData: FormData,
  showError: (message: string) => void,
): ValidationResult | null {
  if (!formData.ingredientId || !formData.parLevel || !formData.unit) {
    showError('Please fill in all required fields');
    return null;
  }
  const reorderPointPercentageValue = formData.reorderPointPercentage || '50';
  const parLevelValue = parseFloat(formData.parLevel);
  const reorderPointPercentage = parseFloat(reorderPointPercentageValue);

  if (isNaN(parLevelValue) || isNaN(reorderPointPercentage)) {
    showError('Par level and reorder point percentage must be valid numbers');
    return null;
  }

  if (parLevelValue <= 0) {
    showError('Par level must be greater than 0');
    return null;
  }

  if (reorderPointPercentage < 0 || reorderPointPercentage > 100) {
    showError('Reorder point percentage must be between 0 and 100');
    return null;
  }
  const reorderPointValue = parLevelValue * (reorderPointPercentage / 100);
  if (reorderPointValue >= parLevelValue) {
    showError('Reorder point must be less than par level');
    return null;
  }

  return {
    isValid: true,
    parLevelValue,
    reorderPointValue,
  };
}
