/**
 * Handle inline entry save.
 */
import type { Shift } from '../../../types';

export function createInlineEntrySaveHandler(
  shifts: Shift[],
  handleCreateShift: (shiftData: Partial<Shift>) => Promise<void>,
  setActiveInlineEntry: (entry: any) => void,
  showError: (message: string) => void,
) {
  return async (shiftData: Partial<Shift>) => {
    const dateStr = shiftData.shift_date!;
    const existingShifts = shifts.filter(
      s => s.employee_id === shiftData.employee_id && s.shift_date === dateStr,
    );
    if (existingShifts.length >= 2) {
      showError('Maximum 2 shifts per day allowed');
      return;
    }
    await handleCreateShift(shiftData);
    setActiveInlineEntry(null);
  };
}
