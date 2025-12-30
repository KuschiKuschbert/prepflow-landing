/**
 * Build request body for prep list form submission.
 */
import type { PrepList, PrepListFormData } from '../../../types';

interface BuildRequestBodyParams {
  formData: PrepListFormData;
  editingPrepList: PrepList | null;
  userId: string;
}

export function buildRequestBody({ formData, editingPrepList, userId }: BuildRequestBodyParams): {
  url: string;
  method: string;
  body: object;
} {
  const url = '/api/prep-lists';
  const method = editingPrepList ? 'PUT' : 'POST';
  const filteredItems = formData.items.filter(item => item.ingredientId && item.quantity);

  const body = editingPrepList
    ? {
        id: editingPrepList.id,
        kitchenSectionId: formData.kitchenSectionId,
        name: formData.name,
        notes: formData.notes,
        status: 'draft',
        items: filteredItems,
      }
    : {
        userId,
        kitchenSectionId: formData.kitchenSectionId,
        name: formData.name,
        notes: formData.notes,
        items: filteredItems,
      };

  return { url, method, body };
}




