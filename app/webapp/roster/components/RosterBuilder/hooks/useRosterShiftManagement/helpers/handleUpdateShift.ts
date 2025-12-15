/**
 * Handle updating an existing shift.
 */
import { logger } from '@/lib/logger';
import type { Shift } from '../../../../../types';

export async function handleUpdateShiftHelper(
  editingShiftId: string,
  shiftData: Partial<Shift>,
  originalShift: Shift,
  updateShift: (id: string, shift: Partial<Shift>) => void,
  setShowShiftForm: (show: boolean) => void,
  setFormEmployeeId: (id: string | undefined) => void,
  setFormDate: (date: Date | undefined) => void,
  setEditingShiftId: (id: string | null) => void,
  showSuccess: (message: string) => void,
  showError: (message: string) => void,
): Promise<void> {
  updateShift(editingShiftId, shiftData);
  try {
    const response = await fetch(`/api/roster/shifts/${editingShiftId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shiftData),
    });
    const result = await response.json();
    if (response.ok && result.shift) {
      updateShift(editingShiftId, result.shift);
      showSuccess('Shift updated successfully');
      setShowShiftForm(false);
      setFormEmployeeId(undefined);
      setFormDate(undefined);
      setEditingShiftId(null);
    } else {
      updateShift(editingShiftId, originalShift);
      showError(result.error || result.message || 'Failed to update shift');
    }
  } catch (err) {
    updateShift(editingShiftId, originalShift);
    logger.error('Failed to update shift', err);
    showError('Failed to update shift. Give it another go, chef.');
  }
}
