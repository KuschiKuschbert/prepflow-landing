import { ApiErrorHandler } from '@/lib/api-error-handler';
import { ParLevelInput } from './types';

/**
 * Validate par level data.
 *
 * @param {ParLevelInput} parLevelData - Par level data to validate
 * @returns {{ingredientId: string, parLevel: number, reorderPoint: number, unit: string}} Validated data
 * @throws {Error} If validation fails
 */
export function validateParLevelData(parLevelData: ParLevelInput) {
  const ingredientId = parLevelData.ingredient_id || parLevelData.ingredientId;
  const parLevel = parLevelData.par_level ?? parLevelData.parLevel;
  const reorderPoint = parLevelData.reorder_point ?? parLevelData.reorderPoint;
  const unit = parLevelData.unit;

  if (!ingredientId || ingredientId === null || ingredientId === undefined) {
    throw ApiErrorHandler.createError('Ingredient ID is required', 'VALIDATION_ERROR', 400);
  }

  if (parLevel === null || parLevel === undefined || isNaN(Number(parLevel))) {
    throw ApiErrorHandler.createError(
      'Par level is required and must be a valid number',
      'VALIDATION_ERROR',
      400,
    );
  }

  if (reorderPoint === null || reorderPoint === undefined || isNaN(Number(reorderPoint))) {
    throw ApiErrorHandler.createError(
      'Reorder point is required and must be a valid number',
      'VALIDATION_ERROR',
      400,
    );
  }

  if (!unit || unit.trim() === '') {
    throw ApiErrorHandler.createError('Unit is required', 'VALIDATION_ERROR', 400);
  }

  return { ingredientId, parLevel, reorderPoint, unit };
}
