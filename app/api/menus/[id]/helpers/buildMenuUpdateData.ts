import { UpdateMenuParams } from '../../types';

/**
 * Build menu update data object from request body.
 *
 * @param {Partial<UpdateMenuParams>} body - Request body
 * @returns {Partial<UpdateMenuParams>} Update data object
 */
export function buildMenuUpdateData(body: Partial<UpdateMenuParams>): Partial<UpdateMenuParams> {
  const updateData: Partial<UpdateMenuParams> = {};

  if (body.menu_name !== undefined) updateData.menu_name = body.menu_name.trim();
  if (body.description !== undefined) updateData.description = body.description?.trim() || null;
  if (body.menu_type !== undefined) updateData.menu_type = body.menu_type;
  if (body.expected_guests !== undefined) updateData.expected_guests = body.expected_guests;

  return updateData;
}
