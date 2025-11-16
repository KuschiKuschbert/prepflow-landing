/**
 * Build update data object for recipe update.
 *
 * @param {Object} body - Request body with recipe fields
 * @returns {Object} Update data object
 */
export function buildUpdateData(body: {
  name?: string;
  yield?: number;
  yield_unit?: string;
  category?: string;
  description?: string;
  instructions?: string;
}) {
  const { name, yield: dishPortions, yield_unit, category, description, instructions } = body;

  const updateData: {
    name?: string;
    yield?: number;
    yield_unit?: string;
    category?: string;
    description?: string | null;
    instructions?: string | null;
    updated_at?: string;
  } = {
    updated_at: new Date().toISOString(),
  };

  if (name !== undefined) updateData.name = name.trim();
  if (dishPortions !== undefined) updateData.yield = dishPortions;
  if (yield_unit !== undefined) updateData.yield_unit = yield_unit;
  if (category !== undefined) updateData.category = category;
  if (description !== undefined) updateData.description = description?.trim() || null;
  if (instructions !== undefined) updateData.instructions = instructions?.trim() || null;

  return updateData;
}
