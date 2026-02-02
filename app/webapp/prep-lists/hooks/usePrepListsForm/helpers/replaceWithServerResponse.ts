/**
 * Replace optimistic update with server response.
 */
import type { PrepList } from '@/lib/types/prep-lists';

interface ReplaceWithServerResponseParams {
  editingPrepList: PrepList | null;
  tempId: string | undefined;
  serverPrepList: PrepList;
  prepLists: PrepList[];
  setPrepLists: React.Dispatch<React.SetStateAction<PrepList[]>>;
}

export function replaceWithServerResponse({
  editingPrepList,
  tempId,
  serverPrepList,
  prepLists: _prepLists,
  setPrepLists,
}: ReplaceWithServerResponseParams): void {
  if (editingPrepList) {
    setPrepLists(prevLists =>
      prevLists.map(list =>
        list.id === editingPrepList.id ? { ...list, ...serverPrepList } : list,
      ),
    );
  } else if (tempId) {
    // Replace temp prep list with real one from server
    setPrepLists(prevLists => prevLists.map(list => (list.id === tempId ? serverPrepList : list)));
  }
}
