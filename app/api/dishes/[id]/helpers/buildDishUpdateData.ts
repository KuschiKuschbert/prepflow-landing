import { Dish } from '../../helpers/schemas';

/**
 * Build update data object for dish update.
 *
 * @param {any} body - Request body with dish fields
 * @returns {Partial<Dish>} Update data object
 */
export function buildDishUpdateData(body: {
  dish_name?: string;
  description?: string;
  selling_price?: number | string;
  category?: string;
}): Partial<Dish> {
  const { dish_name, description, selling_price, category } = body;

  const updateData: Partial<Dish> = {};
  if (dish_name !== undefined) updateData.dish_name = dish_name.trim();
  if (description !== undefined) updateData.description = description?.trim() || null;
  if (selling_price !== undefined) {
    updateData.selling_price =
      typeof selling_price === 'string' ? parseFloat(selling_price) : selling_price;
  }
  if (category !== undefined) updateData.category = category;

  return updateData;
}
