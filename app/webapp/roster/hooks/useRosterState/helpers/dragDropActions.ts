/**
 * Drag and drop action helpers for roster state.
 */
import type { Shift } from '@/lib/types/roster';

import type { RosterStoreSet } from '@/lib/types/roster';

export function createDragDropActions(set: RosterStoreSet) {
  return {
    setDraggedShift: (shift: Shift | null) => set({ draggedShift: shift }),
    setDropTarget: (target: { employeeId: string; date: Date } | null) =>
      set({ dropTarget: target }),
  };
}
