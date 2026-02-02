import { logger } from '@/lib/logger';
import type { Shift } from '@/lib/types/roster';

interface HandleDeleteShiftParams {
  shiftId: string;
  shifts: Shift[];
  removeShift: (id: string) => void;
  addShift: (shift: Shift) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  removeValidationWarning: (shiftId: string) => void;
}

export async function handleDeleteShiftHelper({
  shiftId,
  shifts,
  removeShift,
  addShift,
  showSuccess,
  showError,
  removeValidationWarning,
}: HandleDeleteShiftParams): Promise<void> {
  const shiftToDelete = shifts.find(s => s.id === shiftId);
  if (!shiftToDelete) return;
  removeShift(shiftId);
  try {
    const response = await fetch(`/api/roster/shifts/${shiftId}`, { method: 'DELETE' });
    const result = await response.json();
    if (response.ok) {
      showSuccess('Shift deleted successfully');
      removeValidationWarning(shiftId);
    } else {
      addShift(shiftToDelete);
      showError(result.error || result.message || 'Failed to delete shift');
    }
  } catch (err) {
    addShift(shiftToDelete);
    logger.error('Failed to delete shift', err);
    showError('Failed to delete shift. Give it another go, chef.');
  }
}
