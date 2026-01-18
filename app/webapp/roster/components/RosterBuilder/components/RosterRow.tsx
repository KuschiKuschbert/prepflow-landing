'use client';
import { useDroppable } from '@dnd-kit/core';
import { Icon } from '@/components/ui/Icon';
import { Users, X } from 'lucide-react';
import { logger } from '@/lib/logger';
import type { Shift, Employee, ShiftValidationWarning } from '../../../types';
import { RosterCell } from './RosterCell';

interface RosterRowProps {
  employee: Employee;
  weekDays: Date[];
  getShiftsForDay: (employeeId: string, date: Date) => Shift[];
  validationWarnings: ShiftValidationWarning[];
  onAddShift?: (employeeId: string, date: Date, cellPosition?: DOMRect) => void;
  activeInlineEntry?: { employeeId: string; date: Date; cellPosition?: DOMRect } | null;
  onInlineEntrySave?: (shiftData: Partial<Shift>) => Promise<void>;
  onInlineEntryCancel?: () => void;
  onDeleteShift?: (shiftId: string) => void;
  onEditShift?: (shiftId: string) => void;
  onDeleteEmployee?: (employeeId: string) => void;
}

/**
 * RosterRow Component
 * Displays a row for a single employee with their shifts for the week.
 */
export function RosterRow({
  employee,
  weekDays,
  getShiftsForDay,
  validationWarnings,
  onAddShift,
  activeInlineEntry,
  onInlineEntrySave,
  onInlineEntryCancel,
  onDeleteShift,
  onEditShift,
  onDeleteEmployee,
}: RosterRowProps) {
  const { setNodeRef: _setNodeRef, isOver } = useDroppable({
    id: `employee-${employee.id}`,
    data: {
      type: 'employee',
      employeeId: employee.id,
    },
  });

  return (
    <div className="grid grid-cols-8 gap-2">
      {/* Employee Name */}
      <div className="flex items-center">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon
              icon={Users}
              size="sm"
              className="text-[var(--foreground-muted)]"
              aria-hidden={true}
            />
            <div>
              <div className="font-medium text-[var(--foreground)]">
                {employee.first_name} {employee.last_name}
              </div>
              <div className="text-xs text-[var(--foreground-muted)]">{employee.role}</div>
            </div>
          </div>
          {onDeleteEmployee && (
            <button
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                logger.dev('Delete button clicked for employee:', employee.id);
                try {
                  onDeleteEmployee(employee.id);
                } catch (err) {
                  logger.error('Error in handleDeleteEmployeeFromRoster:', err);
                }
              }}
              className="relative z-10 flex items-center justify-center rounded-full bg-[var(--color-error)]/20 p-1.5 text-[var(--color-error)] opacity-60 transition-all hover:bg-[var(--color-error)]/30 hover:text-red-300 hover:opacity-100"
              aria-label={`Remove ${employee.first_name} ${employee.last_name} from this week's roster`}
            >
              <Icon icon={X} size="xs" aria-hidden={true} />
            </button>
          )}
        </div>
      </div>

      {/* Day Columns */}
      {weekDays.map(day => (
        <RosterCell
          key={`${employee.id}-${day.toISOString()}`}
          employeeId={employee.id}
          date={day}
          shifts={getShiftsForDay(employee.id, day)}
          validationWarnings={validationWarnings}
          isOver={isOver}
          onAddShift={onAddShift}
          activeInlineEntry={activeInlineEntry}
          onInlineEntrySave={onInlineEntrySave}
          onInlineEntryCancel={onInlineEntryCancel}
          onDeleteShift={onDeleteShift}
          onEditShift={onEditShift}
        />
      ))}
    </div>
  );
}
