import { UpdateCleaningTaskInput } from './types';

/**
 * Builds update data object from request body
 *
 * @param {unknown} body - Request body
 * @returns {UpdateCleaningTaskInput} Update data object
 */
export function buildUpdateData(body: unknown): UpdateCleaningTaskInput {
  const data = body as Record<string, unknown>;
  const updateData: UpdateCleaningTaskInput = {};

  if (typeof data.status === 'string') updateData.status = data.status;
  if (typeof data.completed_date === 'string' || data.completed_date === null)
    updateData.completed_date = data.completed_date;
  if (typeof data.notes === 'string' || data.notes === null) updateData.notes = data.notes;
  if (typeof data.photo_url === 'string' || data.photo_url === null)
    updateData.photo_url = data.photo_url;

  return updateData;
}
