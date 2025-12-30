/**
 * Create temporary prep list for optimistic updates.
 */
import type { PrepList, PrepListFormData } from '../../../types';

export function createTempPrepList(formData: PrepListFormData, tempId: string): PrepList {
  return {
    id: tempId,
    kitchen_section_id: formData.kitchenSectionId,
    name: formData.name,
    notes: formData.notes || undefined,
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prep_list_items: [],
    kitchen_sections: {
      id: formData.kitchenSectionId,
      name: '',
      color: '',
    },
  };
}


