/**
 * Handle creating a new shift.
 */
import { logger } from '@/lib/logger';
import type { Shift } from '../../../../../types';
import { createTempShift } from './createTempShift';

export async function handleCreateShiftHelper(
  shiftData: Partial<Shift>,
  addShift: (shift: Shift) => void,
  updateShift: (id: string, shift: Partial<Shift>) => void,
  removeShift: (id: string) => void,
  setShowShiftForm: (show: boolean) => void,
  setFormEmployeeId: (id: string | undefined) => void,
  setFormDate: (date: Date | undefined) => void,
  showSuccess: (message: string) => void,
  showError: (message: string) => void,
): Promise<void> {
  const tempShift = createTempShift(shiftData);
  addShift(tempShift);
  try {
    const response = await fetch('/api/roster/shifts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shiftData),
    });
    const result = await response.json();
    if (response.ok && result.shift) {
      updateShift(tempShift.id, result.shift);
      showSuccess('Shift created successfully');
      setShowShiftForm(false);
      setFormEmployeeId(undefined);
      setFormDate(undefined);
    } else {
      removeShift(tempShift.id);
      showError(result.error || result.message || 'Failed to create shift');
    }
  } catch (err) {
    removeShift(tempShift.id);
    logger.error('Failed to create shift', err);
    showError('Failed to create shift. Give it another go, chef.');
  }
}
