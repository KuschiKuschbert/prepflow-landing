/**
 * Shift action helpers for roster state.
 */
import type { Shift } from '../../../types';

import type { RosterState, RosterStoreGet, RosterStoreSet } from '../types';

export function createShiftActions(set: RosterStoreSet, get: RosterStoreGet) {
  return {
    setShifts: (shifts: Shift[]) => set({ shifts }),
    addShift: (shift: Shift) => set((state: RosterState) => ({ shifts: [...state.shifts, shift] })),
    updateShift: (shiftId: string, updates: Partial<Shift>) =>
      set((state: RosterState) => ({
        shifts: state.shifts.map((shift: Shift) =>
          shift.id === shiftId ? { ...shift, ...updates } : shift,
        ),
      })),
    removeShift: (shiftId: string) =>
      set((state: RosterState) => ({
        shifts: state.shifts.filter((shift: Shift) => shift.id !== shiftId),
        publishedShifts: new Set([...state.publishedShifts].filter((id: string) => id !== shiftId)),
      })),
    getShiftsForDate: (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return get().shifts.filter((shift: Shift) => shift.shift_date === dateStr);
    },
    getShiftsForEmployee: (employeeId: string) =>
      get().shifts.filter((shift: Shift) => shift.employee_id === employeeId),
  };
}
