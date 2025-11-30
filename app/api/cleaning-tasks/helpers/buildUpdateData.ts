/**
 * Helper for building update data for cleaning tasks
 */

/**
 * Builds update data object from request body
 *
 * @param {any} body - Request body
 * @returns {any} Update data object
 */
export function buildUpdateData(body: any): any {
  const { status, completed_date, notes, photo_url } = body;
  const updateData: any = {};

  if (status !== undefined) updateData.status = status;
  if (completed_date !== undefined) updateData.completed_date = completed_date;
  if (notes !== undefined) updateData.notes = notes;
  if (photo_url !== undefined) updateData.photo_url = photo_url;

  return updateData;
}

