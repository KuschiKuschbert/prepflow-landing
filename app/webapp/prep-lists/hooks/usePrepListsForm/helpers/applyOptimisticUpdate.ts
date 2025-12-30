/**
 * Apply optimistic update to prep lists state.
 */
import type { PrepList, PrepListFormData } from '../../../types';

interface ApplyOptimisticUpdateParams {
  editingPrepList: PrepList | null;
  formData: PrepListFormData;
  tempPrepList?: PrepList;
  prepLists: PrepList[];
  setPrepLists: React.Dispatch<React.SetStateAction<PrepList[]>>;
}

export function applyOptimisticUpdate({
  editingPrepList,
  formData,
  tempPrepList,
  prepLists,
  setPrepLists,
}: ApplyOptimisticUpdateParams): void {
  if (editingPrepList) {
    // Update existing prep list
    setPrepLists(prevLists =>
      prevLists.map(list =>
        list.id === editingPrepList.id
          ? {
              ...list,
              name: formData.name,
              notes: formData.notes,
              kitchen_section_id: formData.kitchenSectionId,
            }
          : list,
      ),
    );
  } else if (tempPrepList) {
    // Create temporary prep list for optimistic update
    setPrepLists(prevLists => [...prevLists, tempPrepList]);
  }
}




