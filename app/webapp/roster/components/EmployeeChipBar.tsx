/**
 * EmployeeChipBar Component
 * Horizontally scrollable, filterable employee chip bar for roster builder.
 *
 * @component
 */

'use client';

import { useState, useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Search, User } from 'lucide-react';
import type { Employee, Shift } from '../types';
import { formatCurrency } from '@/lib/services/payroll/calculator';

interface EmployeeChipBarProps {
  employees: Employee[];
  onEmployeeClick: (employeeId: string) => void;
  currentWeekShifts?: Shift[];
  addedEmployeeIds?: Set<string>; // Employees that have been added to roster
}

/**
 * EmployeeChipBar component for displaying and filtering employees.
 *
 * @param {EmployeeChipBarProps} props - Component props
 * @returns {JSX.Element} Rendered employee chip bar
 */
export function EmployeeChipBar({
  employees,
  onEmployeeClick,
  currentWeekShifts = [],
  addedEmployeeIds = new Set(),
}: EmployeeChipBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate shift counts for each employee
  const employeeShiftCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    currentWeekShifts.forEach(shift => {
      counts[shift.employee_id] = (counts[shift.employee_id] || 0) + 1;
    });
    return counts;
  }, [currentWeekShifts]);

  // Filter employees: only show those without shifts AND not yet added to roster
  const employeesWithoutShifts = useMemo(() => {
    return employees.filter(employee => {
      const shiftCount = employeeShiftCounts[employee.id] || 0;
      const isAdded = addedEmployeeIds.has(employee.id);
      return shiftCount === 0 && !isAdded;
    });
  }, [employees, employeeShiftCounts, addedEmployeeIds]);

  // Filter employees based on search query
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) {
      return employeesWithoutShifts;
    }

    const query = searchQuery.toLowerCase().trim();
    return employeesWithoutShifts.filter(employee => {
      const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
      const role = employee.role.toLowerCase();
      return fullName.includes(query) || role.includes(query);
    });
  }, [employeesWithoutShifts, searchQuery]);

  const handleChipClick = (employeeId: string) => {
    onEmployeeClick(employeeId);
  };

  return (
    <div className="space-y-4">
      {/* Search/Filter Input */}
      <div className="relative">
        <Icon
          icon={Search}
          size="sm"
          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
          aria-hidden={true}
        />
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] py-2 pr-4 pl-10 text-white placeholder:text-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20"
        />
      </div>

      {/* Employee Chips - Horizontally Scrollable */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3">
          {filteredEmployees.length === 0 ? (
            <div className="py-4 text-sm text-gray-400">No employees found</div>
          ) : (
            filteredEmployees.map(employee => {
              const hourlyRate = formatCurrency(employee.hourly_rate);
              const saturdayRate = employee.saturday_rate
                ? formatCurrency(employee.saturday_rate)
                : null;
              const sundayRate = employee.sunday_rate ? formatCurrency(employee.sunday_rate) : null;

              return (
                <div key={employee.id} className="group relative">
                  <button
                    onClick={() => handleChipClick(employee.id)}
                    className="flex shrink-0 items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-3 transition-all hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:shadow-lg"
                    aria-label={`Select ${employee.first_name} ${employee.last_name}`}
                  >
                    <Icon
                      icon={User}
                      size="sm"
                      className="text-gray-400 group-hover:text-[#29E7CD]"
                      aria-hidden={true}
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-white group-hover:text-[#29E7CD]">
                        {employee.first_name} {employee.last_name}
                      </span>
                      <span className="text-xs text-gray-400">{employee.role}</span>
                    </div>
                  </button>

                  {/* Tooltip with hourly cost - only visible on hover */}
                  <div
                    className="pointer-events-none invisible absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-xs -translate-x-1/2 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2 text-xs whitespace-nowrap text-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100"
                    aria-hidden={true}
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-[#29E7CD]">Hourly Rates</div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-gray-400">Weekday:</span>
                        <span className="font-medium">{hourlyRate}/hr</span>
                      </div>
                      {saturdayRate && (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-gray-400">Saturday:</span>
                          <span className="font-medium">{saturdayRate}/hr</span>
                        </div>
                      )}
                      {sundayRate && (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-gray-400">Sunday:</span>
                          <span className="font-medium">{sundayRate}/hr</span>
                        </div>
                      )}
                    </div>
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1f1f1f]" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
