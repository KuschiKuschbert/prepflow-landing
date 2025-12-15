import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { useCallback } from 'react';
import type { Employee, Shift } from '../../../types';
import { confirmDeleteAllShifts } from './helpers/confirmDeleteAllShifts';
import { confirmDeleteEmployee } from './helpers/confirmDeleteEmployee';
import { getEmployeeName } from './helpers/getEmployeeName';
import { getEmployeeWeekShifts } from './helpers/getEmployeeWeekShifts';
import { getWeekShifts } from './helpers/getWeekShifts';
import { performDeleteAllShifts } from './helpers/performDeleteAllShifts';
import { performDeleteEmployeeFromRoster } from './helpers/performDeleteEmployeeFromRoster';

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
    const weekShifts = getWeekShifts(shifts, currentWeekStart);
    const shiftsToDelete = weekShifts.length > 0 ? weekShifts : shifts;

    if (shiftsToDelete.length === 0) {
      showError('No shifts found to delete');
      return;
    }

    const confirmed = await confirmDeleteAllShifts({
      shiftsToDelete,
      weekShifts,
      showConfirm,
    });

    if (!confirmed) return;

    await performDeleteAllShifts({
      shifts,
      currentWeekStart,
      removeShift,
      addShift,
      removeValidationWarning,
      showError,
      showSuccess,
    });
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
      const employeeShifts = getEmployeeWeekShifts(shifts, employeeId, currentWeekStart);
      const employeeName = getEmployeeName(employees, employeeId);
      const confirmed = await confirmDeleteEmployee({
        employeeName,
        employeeShiftsCount: employeeShifts.length,
        showConfirm,
      });
      if (!confirmed) return;
      await performDeleteEmployeeFromRoster({
        employeeId,
        shifts,
        employees,
        currentWeekStart,
        addedEmployeeIds,
        setAddedEmployeeIds,
        removeShift,
        addShift,
        removeValidationWarning,
        showError,
        showSuccess,
      });
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
