/**
 * Form submission logic for par levels.
 */
import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { ParLevel, Ingredient } from '../../types';

interface FormSubmissionProps {
  formData: {
    ingredientId: string;
    parLevel: string;
    reorderPointPercentage: string;
    unit: string;
  };
  ingredients: Ingredient[];
  parLevels: ParLevel[];
  setParLevels: React.Dispatch<React.SetStateAction<ParLevel[]>>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  resetForm: () => void;
}

/**
 * Submit par level form with optimistic updates.
 */
export async function submitParLevelForm({
  formData,
  ingredients,
  parLevels,
  setParLevels,
  showError,
  showSuccess,
  resetForm,
}: FormSubmissionProps): Promise<void> {
  if (!formData.ingredientId || !formData.parLevel || !formData.unit) {
    showError('Please fill in all required fields');
    return;
  }
  const reorderPointPercentageValue = formData.reorderPointPercentage || '50';
  const parLevelValue = parseFloat(formData.parLevel);
  const reorderPointPercentage = parseFloat(reorderPointPercentageValue);

  if (isNaN(parLevelValue) || isNaN(reorderPointPercentage)) {
    showError('Par level and reorder point percentage must be valid numbers');
    return;
  }

  if (parLevelValue <= 0) {
    showError('Par level must be greater than 0');
    return;
  }

  if (reorderPointPercentage < 0 || reorderPointPercentage > 100) {
    showError('Reorder point percentage must be between 0 and 100');
    return;
  }
  const reorderPointValue = parLevelValue * (reorderPointPercentage / 100);
  if (reorderPointValue >= parLevelValue) {
    showError('Reorder point must be less than par level');
    return;
  }
  const tempId = `temp-${Date.now()}`;
  const selectedIngredient = ingredients.find(ing => ing.id === formData.ingredientId);
  const tempParLevel: ParLevel = {
    id: tempId,
    ingredient_id: formData.ingredientId,
    par_level: parLevelValue,
    reorder_point: reorderPointValue,
    unit: formData.unit,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ingredients: {
      id: selectedIngredient?.id || formData.ingredientId,
      ingredient_name: selectedIngredient?.ingredient_name || '',
      unit: selectedIngredient?.unit,
      category: selectedIngredient?.category,
    },
  };
  const originalParLevels = [...parLevels];
  setParLevels(prevItems => [...prevItems, tempParLevel]);
  try {
    const response = await fetch('/api/par-levels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ingredientId: formData.ingredientId,
        parLevel: parLevelValue,
        reorderPoint: reorderPointValue,
        unit: formData.unit,
      }),
    });
    let result;
    try {
      const responseText = await response.text();
      logger.dev(`[Par Levels] POST Response status: ${response.status} ${response.statusText}`);
      logger.dev('[Par Levels] POST Response text:', responseText);
      result = JSON.parse(responseText);
      logger.dev('[Par Levels] POST Parsed result:', result);
    } catch (parseError) {
      logger.error('[Par Levels] POST Parse error:', parseError);
      setParLevels(originalParLevels);
      showError(`Server error (${response.status}). Please check the server logs.`);
      return;
    }
    if (response.ok && result.success && result.data) {
      const serverData = result.data;
      if (!serverData.ingredients && tempParLevel.ingredients)
        serverData.ingredients = tempParLevel.ingredients;
      setParLevels(prevItems => {
        const updated = prevItems.map(item => (item.id === tempId ? serverData : item));
        cacheData('par_levels', updated);
        return updated;
      });
      showSuccess('Par level created successfully');
      resetForm();
    } else {
      setParLevels(originalParLevels);
      const errorMessage =
        result.message || result.error || `Failed to create par level (${response.status})`;
      const instructions = result.details?.instructions || [];
      logger.error('[Par Levels] POST API Error:', {
        status: response.status,
        error: errorMessage,
        details: result.details,
        code: result.code,
        fullResponse: result,
        requestBody: {
          ingredientId: formData.ingredientId,
          parLevel: parLevelValue,
          reorderPoint: reorderPointValue,
          unit: formData.unit,
        },
      });
      if (instructions.length > 0) {
        showError(`${errorMessage}\n\n${instructions.join('\n')}`);
        logger.dev('[Par Levels] POST Error Instructions:', instructions);
      } else {
        showError(errorMessage);
      }
    }
  } catch (err) {
    setParLevels(originalParLevels);
    logger.error('[Par Levels] POST Exception:', err);
    showError('Failed to create par level. Please check your connection and try again.');
  }
}
