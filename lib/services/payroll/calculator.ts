/**
 * Payroll Calculator Service
 * Calculates shift costs based on employee rates, day of week, and break deductions.
 *
 * @module payroll/calculator
 */

import { getDay } from 'date-fns';
import type { Shift, Employee, ShiftCostCalculation, RosterBudget } from '@/lib/types/roster';
import { logger } from '@/lib/logger';
import { getRateMultiplier } from './helpers/rateMultiplier';

/**
 * Calculates the cost of a single shift.
 *
 * @param {Shift} shift - The shift to calculate cost for
 * @param {Employee} employee - The employee assigned to the shift
 * @returns {ShiftCostCalculation} Shift cost calculation result
 */
export function calculateShiftCost(shift: Shift, employee: Employee): ShiftCostCalculation {
  const startTime = new Date(shift.start_time);
  const endTime = new Date(shift.end_time);
  const dayOfWeek = getDay(startTime); // 0=Sunday, 1=Monday, ..., 6=Saturday

  // Calculate total hours
  const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  const breakHours = shift.break_duration_minutes / 60;
  const paidHours = totalHours - breakHours;

  // Get base rate
  const baseRate = employee.hourly_rate || 0;

  // Determine rate multiplier based on day of week
  const rateMultiplier = getRateMultiplier(dayOfWeek, employee);

  // Calculate costs
  const totalCost = paidHours * baseRate * rateMultiplier;
  const breakCost = breakHours * baseRate * rateMultiplier;
  const netCost = totalCost;

  return {
    shiftId: shift.id,
    employeeId: employee.id,
    baseHours: totalHours,
    breakHours,
    paidHours,
    baseRate,
    dayOfWeek,
    rateMultiplier,
    totalCost,
    breakCost,
    netCost,
  };
}

/**
 * Calculates total roster budget from shifts.
 *
 * @param {Shift[]} shifts - All shifts in the roster
 * @param {Employee[]} employees - All employees (for rate lookup)
 * @param {number} forecastRevenue - Optional forecast revenue for comparison
 * @returns {RosterBudget} Roster budget calculation
 */
export function calculateRosterBudget(
  shifts: Shift[],
  employees: Employee[],
  forecastRevenue?: number | null,
): RosterBudget {
  const employeeMap = new Map(employees.map(emp => [emp.id, emp]));
  const shiftsByDay: Record<string, ShiftCostCalculation[]> = {};
  let totalHours = 0;
  let totalCost = 0;

  for (const shift of shifts) {
    // Skip cancelled shifts
    if (shift.status === 'cancelled') {
      continue;
    }

    const employee = employeeMap.get(shift.employee_id);
    if (!employee) {
      logger.warn(`Employee not found for shift ${shift.id}: ${shift.employee_id}`);
      continue;
    }

    const calculation = calculateShiftCost(shift, employee);
    const dateKey = shift.shift_date;

    if (!shiftsByDay[dateKey]) {
      shiftsByDay[dateKey] = [];
    }
    shiftsByDay[dateKey].push(calculation);

    totalHours += calculation.paidHours;
    totalCost += calculation.netCost;
  }

  const laborCostPercentage = forecastRevenue ? (totalCost / forecastRevenue) * 100 : null;

  return {
    totalShifts: shifts.length,
    totalHours,
    totalCost,
    forecastRevenue: forecastRevenue || null,
    laborCostPercentage,
    shiftsByDay,
  };
}

// Re-export helper functions for backward compatibility
export { calculateWeeklyCost } from './helpers/weeklyCost';
export { calculateTotalHours } from './helpers/shiftHours';
export { formatCurrency, formatHours } from './helpers/formatting';
