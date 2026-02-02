/**
 * Validation warning action helpers for roster state.
 */
import type { ShiftValidationWarning } from '@/lib/types/roster';

import type { RosterState, RosterStoreSet } from '@/lib/types/roster';

export function createValidationActions(set: RosterStoreSet) {
  return {
    setValidationWarnings: (warnings: ShiftValidationWarning[]) =>
      set({ validationWarnings: warnings }),
    addValidationWarning: (warning: ShiftValidationWarning) =>
      set((state: RosterState) => ({
        validationWarnings: [
          ...state.validationWarnings.filter(
            (w: ShiftValidationWarning) => w.shiftId !== warning.shiftId,
          ),
          warning,
        ],
      })),
    removeValidationWarning: (shiftId: string) =>
      set((state: RosterState) => ({
        validationWarnings: state.validationWarnings.filter(
          (w: ShiftValidationWarning) => w.shiftId !== shiftId,
        ),
      })),
    clearValidationWarnings: () => set({ validationWarnings: [] }),
  };
}
