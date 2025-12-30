/**
 * Weekly cost calculation utilities.
 */
import type { Shift, Employee } from '@/app/webapp/roster/types';
import { calculateShiftCost } from '../calculator';

/**
 * Calculates weekly payroll cost for an employee.
 *
 * @param {Shift[]} employeeShifts - All shifts for the employee
 * @param {Employee} employee - The employee
 * @param {Date} weekStart - Start of the week
 * @returns {number} Total weekly cost
 */
export function calculateWeeklyCost(
  employeeShifts: Shift[],
  employee: Employee,
  weekStart: Date,
): number {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const weekShifts = employeeShifts.filter(shift => {
    const shiftDate = new Date(shift.start_time);
    return shiftDate >= weekStart && shiftDate < weekEnd && shift.status !== 'cancelled';
  });

  let totalCost = 0;
  for (const shift of weekShifts) {
    const calculation = calculateShiftCost(shift, employee);
    totalCost += calculation.netCost;
  }

  return totalCost;
}



