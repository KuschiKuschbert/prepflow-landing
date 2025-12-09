import { useCallback } from 'react';
import { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { format, addDays } from 'date-fns';
import type { Shift, Employee } from '../../../types';
import { validateShift, createValidationWarnings } from '@/lib/services/compliance/validator';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

interface UseRosterDragAndDropProps {
  shifts: Shift[];
  employees: Employee[];
  draggedShift: Shift | null;
  setDraggedShift: (shift: Shift | null) => void;
  setDropTarget: (target: any) => void;
  setActiveShiftId: (id: string | null) => void;
  updateShift: (id: string, shift: Partial<Shift>) => void;
  addValidationWarning: (warning: any) => void;
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
      const { active, over } = event;
      setActiveShiftId(null);
      setDraggedShift(null);
      setDropTarget(null);

      if (!over || !draggedShift) {
        return;
      }

      // Get drop target data
      const dropData = over.data.current;
      if (!dropData || dropData.type !== 'roster-cell') {
        return;
      }

      const { employeeId, date } = dropData;

      // Update shift with new employee and date
      const newShiftDate = format(date, 'yyyy-MM-dd');
      const shiftDate = new Date(newShiftDate);
      const [startHour, startMin] = draggedShift.start_time.split('T')[1].split(':').map(Number);
      const [endHour, endMin] = draggedShift.end_time.split('T')[1].split(':').map(Number);

      const newStartTime = new Date(shiftDate);
      newStartTime.setHours(startHour, startMin, 0, 0);

      let newEndTime = new Date(shiftDate);
      newEndTime.setHours(endHour, endMin, 0, 0);

      // Handle shifts spanning midnight
      if (newEndTime < newStartTime) {
        newEndTime = addDays(newEndTime, 1);
      }

      const updatedShift: Shift = {
        ...draggedShift,
        employee_id: employeeId,
        shift_date: newShiftDate,
        start_time: newStartTime.toISOString(),
        end_time: newEndTime.toISOString(),
      };

      // Validate shift
      const employee = employees.find(e => e.id === employeeId);
      if (employee) {
        validateAndWarn(updatedShift, employee);
      }

      // Update shift in state
      updateShift(draggedShift.id, updatedShift);

      // TODO: Save to API
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
    (event: any) => {
      const { over } = event;
      if (over && over.data.current?.type === 'roster-cell') {
        setDropTarget(over.data.current);
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
