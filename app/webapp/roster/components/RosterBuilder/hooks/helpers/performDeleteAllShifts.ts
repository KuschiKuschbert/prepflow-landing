/**
 * Perform delete all shifts operation with optimistic updates.
 */
import { logger } from '@/lib/logger';
import type { Shift } from '../../../../types';
import { getWeekShifts } from './getWeekShifts';

interface PerformDeleteAllShiftsParams {
  shifts: Shift[];
  currentWeekStart: Date;
  removeShift: (id: string) => void;
  addShift: (shift: Shift) => void;
  removeValidationWarning: (shiftId: string) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export async function performDeleteAllShifts({
  shifts,
  currentWeekStart,
  removeShift,
  addShift,
  removeValidationWarning,
  showError,
  showSuccess,
}: PerformDeleteAllShiftsParams): Promise<void> {
  const weekShifts = getWeekShifts(shifts, currentWeekStart);
  const shiftsToDelete = weekShifts.length > 0 ? weekShifts : shifts;

  if (shiftsToDelete.length === 0) {
    showError('No shifts found to delete');
    return;
  }

  // Store original shifts for rollback
  const originalShifts = [...shifts];

  // Optimistic update - remove all shifts immediately
  shiftsToDelete.forEach(shift => {
    removeShift(shift.id);
    removeValidationWarning(shift.id);
  });

  try {
    // Delete all shifts in parallel
    const deletePromises = shiftsToDelete.map(shift =>
      fetch(`/api/roster/shifts/${shift.id}`, {
        method: 'DELETE',
      }),
    );

    const responses = await Promise.all(deletePromises);
    const results = await Promise.all(responses.map(r => r.json()));

    // Check for errors
    const errors = results.filter((result, index) => !responses[index].ok);
    if (errors.length > 0) {
      // Revert on error - restore all shifts
      originalShifts.forEach(shift => addShift(shift));
      showError(`Failed to delete ${errors.length} shift${errors.length > 1 ? 's' : ''}`);
      return;
    }

    showSuccess(
      `Successfully deleted ${shiftsToDelete.length} shift${shiftsToDelete.length > 1 ? 's' : ''}`,
    );
  } catch (err) {
    // Revert on error - restore all shifts
    originalShifts.forEach(shift => addShift(shift));
    logger.error('Failed to delete all shifts', err);
    showError('Failed to delete shifts. Give it another go, chef.');
  }
}
