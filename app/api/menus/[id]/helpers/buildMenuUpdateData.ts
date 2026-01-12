import { UpdateMenuParams } from '../../types';

/**
 * Build menu update data object from request body.
 *
 * @param {Partial<UpdateMenuParams>} body - Request body
 * @returns {Partial<UpdateMenuParams>} Update data object
 */
export function buildMenuUpdateData(body: Partial<UpdateMenuParams>): Partial<UpdateMenuParams> {
  const updateData: Partial<UpdateMenuParams> = {};

  // Map potentially mismatched fields if necessary, but currently types match
  if (body.menu_name !== undefined) updateData.menu_name = body.menu_name.trim();
  if (body.description !== undefined) updateData.description = body.description?.trim() || null;

  return updateData;
}
