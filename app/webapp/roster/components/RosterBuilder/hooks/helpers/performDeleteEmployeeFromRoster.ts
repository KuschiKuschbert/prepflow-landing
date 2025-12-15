/**
 * Perform delete employee from roster operation with optimistic updates.
 */
import { logger } from '@/lib/logger';
import type { Employee, Shift } from '../../../../types';
import { getEmployeeWeekShifts } from './getEmployeeWeekShifts';
import { deleteShiftsInParallel } from './performDeleteEmployeeFromRoster/helpers/deleteShiftsInParallel';
import { rollbackEmployeeDeletion } from './performDeleteEmployeeFromRoster/helpers/rollbackEmployeeDeletion';

interface PerformDeleteEmployeeFromRosterParams {
  employeeId: string;
  shifts: Shift[];
  employees: Employee[];
  currentWeekStart: Date;
  addedEmployeeIds: Set<string>;
  setAddedEmployeeIds: (ids: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  removeShift: (id: string) => void;
  addShift: (shift: Shift) => void;
  removeValidationWarning: (shiftId: string) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export async function performDeleteEmployeeFromRoster({
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
}: PerformDeleteEmployeeFromRosterParams): Promise<void> {
  logger.dev('handleDeleteEmployeeFromRoster called for employee:', employeeId);
  const employeeShifts = getEmployeeWeekShifts(shifts, employeeId, currentWeekStart);

  const employee = employees.find(e => e.id === employeeId);
  const employeeName = employee ? `${employee.first_name} ${employee.last_name}` : 'this employee';

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
  const originalShifts = [...shifts];
  const wasInAddedEmployees = addedEmployeeIds.has(employeeId);
  employeeShifts.forEach(shift => {
    removeShift(shift.id);
    removeValidationWarning(shift.id);
  });
  if (wasInAddedEmployees) {
    setAddedEmployeeIds(prev => {
      const next = new Set(prev);
      next.delete(employeeId);
      return next;
    });
  }

  try {
    const { responses, results } = await deleteShiftsInParallel(employeeShifts);
    const errors = results.filter((result, index) => !responses[index].ok);
    if (errors.length > 0) {
      rollbackEmployeeDeletion(
        originalShifts,
        wasInAddedEmployees,
        employeeId,
        addShift,
        setAddedEmployeeIds,
      );
      showError(`Failed to delete ${errors.length} shift${errors.length > 1 ? 's' : ''}`);
      return;
    }
    showSuccess(`${employeeName} removed from this week's roster`);
  } catch (err) {
    rollbackEmployeeDeletion(
      originalShifts,
      wasInAddedEmployees,
      employeeId,
      addShift,
      setAddedEmployeeIds,
    );
    logger.error('Failed to delete employee shifts', err);
    showError('Failed to remove employee from roster. Give it another go, chef.');
  }
}
