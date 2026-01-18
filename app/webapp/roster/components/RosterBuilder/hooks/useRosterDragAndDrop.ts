import { useNotification } from '@/contexts/NotificationContext';
import { createValidationWarnings, validateShift } from '@/lib/services/compliance/validator';
import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { useCallback } from 'react';
import type { Employee, Shift, ShiftValidationWarning } from '../../../types';
import { buildUpdatedShift } from './useRosterDragAndDrop/helpers/buildUpdatedShift';

interface RosterCellData {
  type: 'roster-cell';
  employeeId: string;
  date: Date;
}

interface UseRosterDragAndDropProps {
  shifts: Shift[];
  employees: Employee[];
  draggedShift: Shift | null;
  setDraggedShift: (shift: Shift | null) => void;
  setDropTarget: (target: RosterCellData | null) => void;
  setActiveShiftId: (id: string | null) => void;
  updateShift: (id: string, shift: Partial<Shift>) => void;
  addValidationWarning: (warning: ShiftValidationWarning) => void;
}

/**
 * Hook for handling drag and drop operations in roster builder
 */
export function useRosterDragAndDrop({
  shifts,
  employees,
  draggedShift,
  setDraggedShift,
  setDropTarget,
  setActiveShiftId,
  updateShift,
  addValidationWarning,
}: UseRosterDragAndDropProps) {
  const { showSuccess } = useNotification();

  const validateAndWarn = useCallback(
    (shift: Shift, employee: Employee) => {
      const employeeShifts = shifts.filter(s => s.employee_id === employee.id && s.id !== shift.id);
      const complianceResult = validateShift(shift, employeeShifts, employee);
      const warnings = createValidationWarnings(complianceResult, shift.id);
      warnings.forEach(warning => addValidationWarning(warning));
    },
    [shifts, addValidationWarning],
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const shift = shifts.find(s => s.id === active.id);
      if (shift) {
        setDraggedShift(shift);
        setActiveShiftId(shift.id);
      }
    },
    [shifts, setDraggedShift, setActiveShiftId],
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active: _active, over } = event;
      setActiveShiftId(null);
      setDraggedShift(null);
      setDropTarget(null);
      if (!over || !draggedShift) return;
      const dropData = over.data.current as RosterCellData | undefined;
      if (!dropData || dropData.type !== 'roster-cell') return;

      const { employeeId, date } = dropData;
      const updatedShift = buildUpdatedShift(draggedShift, employeeId, date);
      const employee = employees.find(e => e.id === employeeId);
      if (employee) validateAndWarn(updatedShift, employee);
      updateShift(draggedShift.id, updatedShift);
      showSuccess('Shift moved successfully');
    },
    [
      draggedShift,
      employees,
      updateShift,
      validateAndWarn,
      showSuccess,
      setDraggedShift,
      setDropTarget,
      setActiveShiftId,
    ],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { over } = event;
      if (over && over.data.current?.type === 'roster-cell') {
        setDropTarget(over.data.current as RosterCellData);
      }
    },
    [setDropTarget],
  );

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  };
}
