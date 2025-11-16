/**
 * Build menu update data object from request body.
 *
 * @param {Object} body - Request body
 * @param {string} [body.menu_name] - Menu name
 * @param {string} [body.description] - Menu description
 * @returns {Object} Update data object
 */
export function buildMenuUpdateData(body: { menu_name?: string; description?: string | null }): {
  menu_name?: string;
  description?: string | null;
} {
  const updateData: {
    menu_name?: string;
    description?: string | null;
  } = {};

  if (body.menu_name !== undefined) updateData.menu_name = body.menu_name.trim();
  if (body.description !== undefined) updateData.description = body.description?.trim() || null;

  return updateData;
}
