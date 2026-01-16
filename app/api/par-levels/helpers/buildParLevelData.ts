import { ParLevelInput } from './types';

/**
 * Build par level data object from request body.
 *
 * @param {ParLevelInput} body - Request body
 * @returns {Object} Par level data object
 */
export function buildParLevelData(body: ParLevelInput) {
  const parLevel = body.par_level || body.parLevel;
  const reorderPoint = body.reorder_point || body.reorderPoint;

  return {
    ingredient_id: body.ingredient_id || body.ingredientId,
    par_level: parLevel != null ? parseFloat(String(parLevel)) : null,
    reorder_point: reorderPoint != null ? parseFloat(String(reorderPoint)) : null,
    unit: body.unit || null,
  };
}
