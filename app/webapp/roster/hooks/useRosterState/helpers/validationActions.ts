/**
 * Validation warning action helpers for roster state.
 */
import type { ShiftValidationWarning } from '../../../types';

export function createValidationActions(set: any) {
  return {
    setValidationWarnings: (warnings: ShiftValidationWarning[]) =>
      set({ validationWarnings: warnings }),
    addValidationWarning: (warning: ShiftValidationWarning) =>
      set((state: any) => ({
        validationWarnings: [
          ...state.validationWarnings.filter(
            (w: ShiftValidationWarning) => w.shiftId !== warning.shiftId,
          ),
          warning,
        ],
      })),
    removeValidationWarning: (shiftId: string) =>
      set((state: any) => ({
        validationWarnings: state.validationWarnings.filter(
          (w: ShiftValidationWarning) => w.shiftId !== shiftId,
        ),
      })),
    clearValidationWarnings: () => set({ validationWarnings: [] }),
  };
}
