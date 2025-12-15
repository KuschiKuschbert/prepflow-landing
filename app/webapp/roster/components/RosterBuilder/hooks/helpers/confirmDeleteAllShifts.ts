/**
 * Show confirmation dialog for deleting all shifts.
 */
import type { Shift } from '../../../../types';

interface ConfirmDeleteAllShiftsParams {
  shiftsToDelete: Shift[];
  weekShifts: Shift[];
  showConfirm: (options: {
    title: string;
    message: string;
    variant: 'danger';
    confirmLabel: string;
    cancelLabel: string;
  }) => Promise<boolean>;
}

export async function confirmDeleteAllShifts({
  shiftsToDelete,
  weekShifts,
  showConfirm,
}: ConfirmDeleteAllShiftsParams): Promise<boolean> {
  return await showConfirm({
    title: 'Delete All Shifts',
    message: `Are you sure you want to delete all ${shiftsToDelete.length} shift${shiftsToDelete.length > 1 ? 's' : ''}${weekShifts.length > 0 ? ' for this week' : ''}? This action can't be undone.`,
    variant: 'danger',
    confirmLabel: 'Delete All',
    cancelLabel: 'Cancel',
  });
}
