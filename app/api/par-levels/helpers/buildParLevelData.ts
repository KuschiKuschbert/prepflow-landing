/**
 * Build par level data object from request body.
 *
 * @param {Object} body - Request body
 * @returns {Object} Par level data object
 */
export function buildParLevelData(body: any) {
  return {
    ingredient_id: body.ingredient_id || body.ingredientId,
    par_level: body.par_level || body.parLevel ? parseFloat(body.par_level || body.parLevel) : null,
    reorder_point:
      body.reorder_point || body.reorderPoint
        ? parseFloat(body.reorder_point || body.reorderPoint)
        : null,
    unit: body.unit || null,
  };
}
