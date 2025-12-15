/**
 * Drag and drop action helpers for roster state.
 */
import type { Shift } from '../../../types';

export function createDragDropActions(set: any) {
  return {
    setDraggedShift: (shift: Shift | null) => set({ draggedShift: shift }),
    setDropTarget: (target: { employeeId: string; date: Date } | null) => set({ dropTarget: target }),
  };
}
