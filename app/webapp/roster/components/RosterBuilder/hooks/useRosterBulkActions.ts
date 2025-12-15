import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';
import { addDays, format } from 'date-fns';
import { useCallback } from 'react';
import type { Employee, Shift } from '../../../types';

interface UseRosterBulkActionsProps {
  shifts: Shift[];
  employees: Employee[];
  currentWeekStart: Date;
  removeShift: (id: string) => void;
  addShift: (shift: Shift) => void;
  removeValidationWarning: (shiftId: string) => void;
  addedEmployeeIds: Set<string>;
  setAddedEmployeeIds: (ids: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
}

/**
 * Hook for handling bulk actions (delete all shifts, delete employee from roster)
 */
export function useRosterBulkActions({
  shifts,
  employees,
  currentWeekStart,
  removeShift,
  addShift,
  removeValidationWarning,
  addedEmployeeIds,
  setAddedEmployeeIds,
}: UseRosterBulkActionsProps) {
  const { showError, showSuccess } = useNotification();
  const { showConfirm } = useConfirm();

  const handleDeleteAllShifts = useCallback(async () => {
    const weekEnd = addDays(currentWeekStart, 6);
    const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
    const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

    // Filter shifts for current week
    const weekShifts = shifts.filter(shift => {
      const shiftDate = shift.shift_date;
      return shiftDate >= weekStartStr && shiftDate <= weekEndStr;
    });

    // If no shifts in current week, use all shifts (they might be from a different week)
    const shiftsToDelete = weekShifts.length > 0 ? weekShifts : shifts;

    if (shiftsToDelete.length === 0) {
      showError('No shifts found to delete');
      return;
    }

    const confirmed = await showConfirm({
      title: 'Delete All Shifts',
      message: `Are you sure you want to delete all ${shiftsToDelete.length} shift${shiftsToDelete.length > 1 ? 's' : ''}${weekShifts.length > 0 ? ' for this week' : ''}? This action can't be undone.`,
      variant: 'danger',
      confirmLabel: 'Delete All',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) return;

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
      showError('Failed to delete shifts. Please try again.');
    }
  }, [
    currentWeekStart,
    shifts,
    removeShift,
    addShift,
    removeValidationWarning,
    showConfirm,
    showSuccess,
    showError,
  ]);

  const handleDeleteEmployeeFromRoster = useCallback(
    async (employeeId: string) => {
      logger.dev('handleDeleteEmployeeFromRoster called for employee:', employeeId);
      const weekEnd = addDays(currentWeekStart, 6);
      const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
      const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

      // Find all shifts for this employee in the current week
      const employeeShifts = shifts.filter(shift => {
        const shiftDate = shift.shift_date;
        return (
          shift.employee_id === employeeId && shiftDate >= weekStartStr && shiftDate <= weekEndStr
        );
      });

      const employee = employees.find(e => e.id === employeeId);
      const employeeName = employee
        ? `${employee.first_name} ${employee.last_name}`
        : 'this employee';

      // Always show confirmation dialog
      logger.dev('Showing confirmation dialog for:', employeeName);
      const confirmed = await showConfirm({
        title: 'Remove Employee from Roster',
        message: `Are you sure you want to 86 ${employeeName} from this week's roster?${employeeShifts.length > 0 ? ` This will delete all ${employeeShifts.length} shift${employeeShifts.length > 1 ? 's' : ''} for this week's roster.` : ''} This action can't be undone.`,
        variant: 'danger',
        confirmLabel: '86 Them',
        cancelLabel: 'Cancel',
      });
      logger.dev('Confirmation result:', confirmed);

      if (!confirmed) return;

      // If no shifts, just remove from addedEmployeeIds if present
      if (employeeShifts.length === 0) {
        if (addedEmployeeIds.has(employeeId)) {
          setAddedEmployeeIds(prev => {
            const next = new Set(prev);
            next.delete(employeeId);
            return next;
          });
          showSuccess(`${employeeName} removed from roster`);
        } else {
          showError('No shifts found for this employee in the current week');
        }
        return;
      }

      // Store original shifts for rollback
      const originalShifts = [...shifts];
      // Store whether employee was in addedEmployeeIds before removal
      const wasInAddedEmployees = addedEmployeeIds.has(employeeId);

      // Optimistic update - remove all shifts immediately
      employeeShifts.forEach(shift => {
        removeShift(shift.id);
        removeValidationWarning(shift.id);
      });

      // Remove from addedEmployeeIds if present
      if (wasInAddedEmployees) {
        setAddedEmployeeIds(prev => {
          const next = new Set(prev);
          next.delete(employeeId);
          return next;
        });
      }

      try {
        // Delete all shifts in parallel
        const deletePromises = employeeShifts.map(shift =>
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
          // Restore addedEmployeeIds if it was removed
          if (wasInAddedEmployees) {
            setAddedEmployeeIds(prev => new Set(prev).add(employeeId));
          }
          showError(`Failed to delete ${errors.length} shift${errors.length > 1 ? 's' : ''}`);
          return;
        }

        showSuccess(`${employeeName} removed from this week's roster`);
      } catch (err) {
        // Revert on error - restore all shifts
        originalShifts.forEach(shift => addShift(shift));
        // Restore addedEmployeeIds if it was removed
        if (wasInAddedEmployees) {
          setAddedEmployeeIds(prev => new Set(prev).add(employeeId));
        }
        logger.error('Failed to delete employee shifts', err);
        showError('Failed to remove employee from roster. Please try again.');
      }
    },
    [
      currentWeekStart,
      shifts,
      employees,
      addedEmployeeIds,
      removeShift,
      addShift,
      removeValidationWarning,
      showConfirm,
      showSuccess,
      showError,
      setAddedEmployeeIds,
    ],
  );

  return {
    handleDeleteAllShifts,
    handleDeleteEmployeeFromRoster,
  };
}
