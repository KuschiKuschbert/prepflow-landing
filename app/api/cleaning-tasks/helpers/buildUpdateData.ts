/**
 * Helper for building update data for cleaning tasks
 */

interface CleaningTaskUpdateData {
  status?: string;
  completed_date?: string | null;
  notes?: string | null;
  photo_url?: string | null;
}

/**
 * Builds update data object from request body
 *
 * @param {unknown} body - Request body
 * @returns {CleaningTaskUpdateData} Update data object
 */
export function buildUpdateData(body: unknown): CleaningTaskUpdateData {
  const { status, completed_date, notes, photo_url } = body as Record<string, unknown>;
  const updateData: CleaningTaskUpdateData = {};

  if (status !== undefined) updateData.status = status as string;
  if (completed_date !== undefined) updateData.completed_date = completed_date as string | null;
  if (notes !== undefined) updateData.notes = notes as string | null;
  if (photo_url !== undefined) updateData.photo_url = photo_url as string | null;

  return updateData;
}
