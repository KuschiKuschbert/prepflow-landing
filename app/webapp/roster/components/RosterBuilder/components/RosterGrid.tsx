'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { format } from 'date-fns';
import type { Employee, Shift, ShiftValidationWarning } from '../../../types';
import { ShiftCard } from '../../ShiftCard';
import { getCurrentWeekShifts } from '../utils/rosterHelpers';
import { RosterRow } from './RosterRow';

interface RosterGridProps {
  shifts: Shift[];
  employees: Employee[];
  employeesInRoster: Employee[];
  currentWeekStart: Date;
  weekDays: Date[];
  validationWarnings: ShiftValidationWarning[];
  activeShiftId: string | null;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  getShiftsForEmployeeAndDay: (employeeId: string, date: Date) => Shift[];
  onAddShift?: (employeeId: string, date: Date, cellPosition?: DOMRect) => void;
  activeInlineEntry?: { employeeId: string; date: Date; cellPosition?: DOMRect } | null;
  onInlineEntrySave?: (shiftData: Partial<Shift>) => Promise<void>;
  onInlineEntryCancel?: () => void;
  onDeleteShift?: (shiftId: string) => void;
  onEditShift?: (shiftId: string) => void;
  onDeleteEmployee?: (employeeId: string) => void;
}

/**
 * RosterGrid component - displays the main roster grid with drag and drop
 */
export function RosterGrid({
  shifts,
  employees,
  employeesInRoster,
  currentWeekStart,
  weekDays,
  validationWarnings,
  activeShiftId,
  onDragStart,
  onDragEnd,
  onDragOver,
  getShiftsForEmployeeAndDay,
  onAddShift,
  activeInlineEntry,
  onInlineEntrySave,
  onInlineEntryCancel,
  onDeleteShift,
  onEditShift,
  onDeleteEmployee,
}: RosterGridProps) {
  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
  );

  const _currentWeekShifts = getCurrentWeekShifts(shifts, currentWeekStart);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      modifiers={[snapCenterToCursor]}
    >
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row */}
          <div className="mb-2 grid grid-cols-8 gap-2">
            <div className="font-semibold text-[var(--foreground-muted)]">Employee</div>
            {weekDays.map(day => (
              <div key={day.toISOString()} className="text-center">
                <div className="font-semibold text-[var(--foreground)]">{format(day, 'EEE')}</div>
                <div className="text-sm text-[var(--foreground-muted)]">{format(day, 'MMM d')}</div>
              </div>
            ))}
          </div>

          {/* Employee Rows */}
          <div className="space-y-2">
            {employeesInRoster.map(employee => (
              <RosterRow
                key={employee.id}
                employee={employee}
                weekDays={weekDays}
                getShiftsForDay={getShiftsForEmployeeAndDay}
                validationWarnings={validationWarnings}
                onAddShift={onAddShift}
                activeInlineEntry={activeInlineEntry}
                onInlineEntrySave={onInlineEntrySave}
                onInlineEntryCancel={onInlineEntryCancel}
                onDeleteShift={onDeleteShift}
                onEditShift={onEditShift}
                onDeleteEmployee={onDeleteEmployee}
              />
            ))}
          </div>
        </div>
      </div>
      <DragOverlay style={{ cursor: 'grabbing' }}>
        {activeShiftId
          ? (() => {
              const draggedShiftData = shifts.find(s => s.id === activeShiftId);
              if (!draggedShiftData) return null;
              const shiftWarnings = validationWarnings.filter(
                w => w.shiftId === draggedShiftData.id,
              );
              const employee = employees.find(e => e.id === draggedShiftData.employee_id);
              return (
                <ShiftCard
                  shift={draggedShiftData}
                  warnings={shiftWarnings}
                  isDragging={true}
                  employeeName={
                    employee ? `${employee.first_name} ${employee.last_name}` : undefined
                  }
                />
              );
            })()
          : null}
      </DragOverlay>
    </DndContext>
  );
}
