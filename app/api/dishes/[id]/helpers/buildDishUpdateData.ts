/**
 * Build update data object for dish update.
 *
 * @param {Object} body - Request body with dish fields
 * @returns {Object} Update data object
 */
export function buildDishUpdateData(body: {
  dish_name?: string;
  description?: string;
  selling_price?: number | string;
}) {
  const { dish_name, description, selling_price } = body;

  const updateData: { dish_name?: string; description?: string | null; selling_price?: number } =
    {};
  if (dish_name !== undefined) updateData.dish_name = dish_name.trim();
  if (description !== undefined) updateData.description = description?.trim() || null;
  if (selling_price !== undefined) updateData.selling_price = parseFloat(selling_price as string);

  return updateData;
}
