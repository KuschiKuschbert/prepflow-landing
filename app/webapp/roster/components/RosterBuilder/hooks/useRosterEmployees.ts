import { useState, useMemo, useCallback } from 'react';
import { format, addDays } from 'date-fns';
import type { Shift, Employee } from '@/lib/types/roster';

interface UseRosterEmployeesProps {
  employees: Employee[];
  shifts: Shift[];
  currentWeekStart: Date;
}

/**
 * Hook for managing employees in roster
 */
export function useRosterEmployees({
  employees,
  shifts,
  currentWeekStart,
}: UseRosterEmployeesProps) {
  // Track which employees have been added to the roster (even without shifts yet)
  const [addedEmployeeIds, setAddedEmployeeIds] = useState<Set<string>>(new Set());

  // Handle employee chip click - add employee to roster (no modal)
  const handleEmployeeChipClick = useCallback((employeeId: string) => {
    // Add employee to the roster (they'll show up even without shifts)
    setAddedEmployeeIds(prev => new Set(prev).add(employeeId));
  }, []);

  // Get employees that should be shown in the roster (have shifts OR have been added)
  const employeesInRoster = useMemo(() => {
    const weekEnd = addDays(currentWeekStart, 6);
    const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
    const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

    // Get unique employee IDs that have shifts in this week
    const employeeIdsWithShifts = new Set(
      shifts
        .filter(shift => {
          const shiftDate = shift.shift_date;
          return shiftDate >= weekStartStr && shiftDate <= weekEndStr;
        })
        .map(shift => shift.employee_id),
    );

    // Return employees that have shifts OR have been added to roster
    return employees.filter(
      employee => employeeIdsWithShifts.has(employee.id) || addedEmployeeIds.has(employee.id),
    );
  }, [employees, shifts, currentWeekStart, addedEmployeeIds]);

  return {
    employeesInRoster,
    addedEmployeeIds,
    setAddedEmployeeIds,
    handleEmployeeChipClick,
  };
}
