/**
 * Form submission logic for par levels.
 */
import { logger } from '@/lib/logger';
import type { ParLevel, Ingredient } from '../../types';
import { validateFormData } from './formSubmission/helpers/validateFormData';
import { parseResponse } from './formSubmission/helpers/parseResponse';
import { handleSuccess } from './formSubmission/helpers/handleSuccess';
import { handleError } from './formSubmission/helpers/handleError';
import { createTempParLevel } from './formSubmission/helpers/createTempParLevel';

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
  const validation = validateFormData(formData, showError);
  if (!validation) return;

  const { parLevelValue, reorderPointValue } = validation;
  const tempId = `temp-${Date.now()}`;
  const tempParLevel = createTempParLevel({
    formData,
    ingredients,
    parLevelValue: parLevelValue!,
    reorderPointValue: reorderPointValue!,
    tempId,
  });
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
      result = await parseResponse(response);
    } catch (parseError) {
      logger.error('[formSubmission.ts] Error in catch block:', {
      error: parseError instanceof Error ? parseError.message : String(parseError),
      stack: parseError instanceof Error ? parseError.stack : undefined,
    });

      setParLevels(originalParLevels);
      showError(parseError instanceof Error ? parseError.message : 'Server error');
      return;
    }
    if (response.ok && result.success && result.data) {
      handleSuccess({
        result,
        tempId,
        tempParLevel,
        setParLevels,
        showSuccess,
        resetForm,
      });
    } else {
      handleError({
        response,
        result,
        formData,
        parLevelValue: parLevelValue!,
        reorderPointValue: reorderPointValue!,
        setParLevels,
        originalParLevels,
        showError,
      });
    }
  } catch (err) {
    setParLevels(originalParLevels);
    logger.error('[Par Levels] POST Exception:', err);
    showError('Failed to create par level. Please check your connection and try again.');
  }
}
