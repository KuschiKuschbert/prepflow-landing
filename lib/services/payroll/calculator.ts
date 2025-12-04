/**
 * Payroll Calculator Service
 * Calculates shift costs based on employee rates, day of week, and break deductions.
 *
 * @module payroll/calculator
 */

import { getDay } from 'date-fns';
import type {
  Shift,
  Employee,
  ShiftCostCalculation,
  RosterBudget,
} from '@/app/webapp/roster/types';
import { logger } from '@/lib/logger';

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
 * Gets the rate multiplier for a given day of week.
 * Saturday and Sunday typically have penalty rates in Australian hospitality.
 *
 * @param {number} dayOfWeek - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @param {Employee} employee - The employee
 * @returns {number} Rate multiplier (1.0 for weekdays, >1.0 for weekends)
 */
function getRateMultiplier(dayOfWeek: number, employee: Employee): number {
  // Saturday (6)
  if (dayOfWeek === 6) {
    if (employee.saturday_rate) {
      // If saturday_rate is a multiplier (e.g., 1.25)
      if (employee.saturday_rate <= 5) {
        return employee.saturday_rate;
      }
      // If saturday_rate is an absolute rate, calculate multiplier
      return employee.saturday_rate / (employee.hourly_rate || 1);
    }
    // Default Saturday penalty: 1.25x (time and a quarter)
    return 1.25;
  }

  // Sunday (0)
  if (dayOfWeek === 0) {
    if (employee.sunday_rate) {
      // If sunday_rate is a multiplier (e.g., 1.5)
      if (employee.sunday_rate <= 5) {
        return employee.sunday_rate;
      }
      // If sunday_rate is an absolute rate, calculate multiplier
      return employee.sunday_rate / (employee.hourly_rate || 1);
    }
    // Default Sunday penalty: 1.5x (time and a half)
    return 1.5;
  }

  // Weekdays (Monday-Friday)
  return 1.0;
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

/**
 * Calculates total hours worked in a period.
 *
 * @param {Shift[]} shifts - Shifts to calculate hours for
 * @returns {number} Total hours (excluding breaks)
 */
export function calculateTotalHours(shifts: Shift[]): number {
  let totalHours = 0;

  for (const shift of shifts) {
    if (shift.status === 'cancelled') {
      continue;
    }

    const startTime = new Date(shift.start_time);
    const endTime = new Date(shift.end_time);
    const totalShiftHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const breakHours = shift.break_duration_minutes / 60;
    totalHours += totalShiftHours - breakHours;
  }

  return totalHours;
}

/**
 * Formats currency amount for display.
 *
 * @param {number} amount - Amount in AUD
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats hours for display.
 *
 * @param {number} hours - Hours (decimal)
 * @returns {string} Formatted hours string (e.g., "8.5h" or "8h 30m")
 */
export function formatHours(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (minutes === 0) {
    return `${wholeHours}h`;
  }

  return `${wholeHours}h ${minutes}m`;
}
