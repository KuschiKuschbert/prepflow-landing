import { useState, useCallback, useMemo } from 'react';
import type { Shift } from '@/lib/types/roster';

interface UseRosterFormProps {
  shifts: Shift[];
  editingShiftId: string | null;
  setShowShiftForm: (show: boolean) => void;
  setFormEmployeeId: (id: string | undefined) => void;
  setFormDate: (date: Date | undefined) => void;
  setEditingShiftId: (id: string | null) => void;
}

/**
 * Hook for managing form state and inline entry state
 */
export function useRosterForm({
  shifts,
  editingShiftId,
  setShowShiftForm,
  setFormEmployeeId,
  setFormDate,
  setEditingShiftId,
}: UseRosterFormProps) {
  const [activeInlineEntry, setActiveInlineEntry] = useState<{
    employeeId: string;
    date: Date;
    cellPosition?: DOMRect;
  } | null>(null);

  const handleOpenNewShiftForm = useCallback(
    (employeeId?: string, date?: Date) => {
      // Close any active inline entry
      setActiveInlineEntry(null);
      setFormEmployeeId(employeeId);
      setFormDate(date);
      setEditingShiftId(null);
      setShowShiftForm(true);
    },
    [setShowShiftForm, setEditingShiftId, setFormEmployeeId, setFormDate],
  );

  const handleOpenEditShiftForm = useCallback(
    (shiftId: string) => {
      // Close any active inline entry
      setActiveInlineEntry(null);
      const shift = shifts.find(s => s.id === shiftId);
      if (shift) {
        setFormEmployeeId(shift.employee_id);
        setFormDate(new Date(shift.shift_date));
        setEditingShiftId(shiftId);
        setShowShiftForm(true);
      }
    },
    [shifts, setShowShiftForm, setEditingShiftId, setFormEmployeeId, setFormDate],
  );

  const handleCloseForm = useCallback(() => {
    setShowShiftForm(false);
    setFormEmployeeId(undefined);
    setFormDate(undefined);
    setEditingShiftId(null);
  }, [setShowShiftForm, setEditingShiftId, setFormEmployeeId, setFormDate]);

  const handleCellClickForInline = useCallback(
    (employeeId: string, date: Date, cellPosition?: DOMRect) => {
      setActiveInlineEntry({ employeeId, date, cellPosition });
    },
    [],
  );

  const handleInlineEntryCancel = useCallback(() => {
    setActiveInlineEntry(null);
  }, []);

  const editingShift = useMemo(() => {
    if (editingShiftId) {
      return shifts.find(s => s.id === editingShiftId);
    }
    return undefined;
  }, [editingShiftId, shifts]);

  return {
    activeInlineEntry,
    setActiveInlineEntry,
    handleOpenNewShiftForm,
    handleOpenEditShiftForm,
    handleCloseForm,
    handleCellClickForInline,
    handleInlineEntryCancel,
    editingShift,
  };
}
