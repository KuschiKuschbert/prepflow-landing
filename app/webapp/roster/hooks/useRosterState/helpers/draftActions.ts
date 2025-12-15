/**
 * Draft mode action helpers for roster state.
 */
import type { ShiftStatus } from '../../../types';

export function createDraftActions(set: any) {
  return {
    setIsDraftMode: (isDraft: boolean) => set({ isDraftMode: isDraft }),
    publishShifts: (shiftIds: string[]) =>
      set((state: any) => {
        const newPublished = new Set([...state.publishedShifts, ...shiftIds]);
        return {
          publishedShifts: newPublished,
          shifts: state.shifts.map((shift: any) =>
            shiftIds.includes(shift.id)
              ? {
                  ...shift,
                  status: 'published' as ShiftStatus,
                  published_at: new Date().toISOString(),
                }
              : shift,
          ),
        };
      }),
    unpublishShifts: (shiftIds: string[]) =>
      set((state: any) => {
        const newPublished = new Set(
          [...state.publishedShifts].filter((id: string) => !shiftIds.includes(id)),
        );
        return {
          publishedShifts: newPublished,
          shifts: state.shifts.map((shift: any) =>
            shiftIds.includes(shift.id)
              ? { ...shift, status: 'draft' as ShiftStatus, published_at: null }
              : shift,
          ),
        };
      }),
  };
}
