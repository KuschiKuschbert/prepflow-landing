import { logger } from '@/lib/logger';
import type { ParLevel } from '../../../../types';

interface HandleErrorParams {
  response: Response;
  result: { message?: string; error?: string; code?: string; details?: { instructions?: string[] } };
  formData: {
    ingredientId: string;
    parLevel: string;
    reorderPointPercentage: string;
    unit: string;
  };
  parLevelValue: number;
  reorderPointValue: number;
  setParLevels: React.Dispatch<React.SetStateAction<ParLevel[]>>;
  originalParLevels: ParLevel[];
  showError: (message: string) => void;
}

export function handleError({
  response,
  result,
  formData,
  parLevelValue,
  reorderPointValue,
  setParLevels,
  originalParLevels,
  showError,
}: HandleErrorParams) {
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
