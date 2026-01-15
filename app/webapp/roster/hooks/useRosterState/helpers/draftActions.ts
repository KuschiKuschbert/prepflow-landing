/**
 * Draft mode action helpers for roster state.
 */
import type { Shift, ShiftStatus } from '../../../types';

import type { RosterState, RosterStoreSet } from '../types';

export function createDraftActions(set: RosterStoreSet) {
  return {
    setIsDraftMode: (isDraft: boolean) => set({ isDraftMode: isDraft }),
    publishShifts: (shiftIds: string[]) =>
      set((state: RosterState) => {
        const newPublished = new Set([...state.publishedShifts, ...shiftIds]);
        return {
          publishedShifts: newPublished,
          shifts: state.shifts.map((shift: Shift) =>
            shiftIds.includes(shift.id)
              ? {
                  ...shift,
                  status: 'published' as ShiftStatus,
                  published_at: new Date().toISOString(),
                  is_published: true, // Also set is_published flag if needed
                }
              : shift,
          ),
        };
      }),
    unpublishShifts: (shiftIds: string[]) =>
      set((state: RosterState) => {
        const newPublished = new Set(
          [...state.publishedShifts].filter((id: string) => !shiftIds.includes(id)),
        );
        return {
          publishedShifts: newPublished,
          shifts: state.shifts.map((shift: Shift) =>
            shiftIds.includes(shift.id)
              ? { ...shift, status: 'draft' as ShiftStatus, published_at: null, is_published: false }
              : shift,
          ),
        };
      }),
  };
}
