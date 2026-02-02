/**
 * Rollback employee deletion on error.
 */
import type { Shift } from '@/lib/types/roster';

export function rollbackEmployeeDeletion(
  originalShifts: Shift[],
  wasInAddedEmployees: boolean,
  employeeId: string,
  addShift: (shift: Shift) => void,
  setAddedEmployeeIds: (ids: Set<string> | ((prev: Set<string>) => Set<string>)) => void,
): void {
  originalShifts.forEach(shift => addShift(shift));
  if (wasInAddedEmployees) {
    setAddedEmployeeIds(prev => new Set(prev).add(employeeId));
  }
}
