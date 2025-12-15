import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useCallback, useState } from 'react';
import type { Shift } from '../../../types';
import { handleCreateShiftHelper } from './useRosterShiftManagement/helpers/handleCreateShift';
import { handleUpdateShiftHelper } from './useRosterShiftManagement/helpers/handleUpdateShift';

interface UseRosterShiftManagementProps {
  shifts: Shift[];
  currentWeekStart: Date;
  addShift: (shift: Shift) => void;
  updateShift: (id: string, shift: Partial<Shift>) => void;
  removeShift: (id: string) => void;
  setShowShiftForm: (show: boolean) => void;
  setFormEmployeeId: (id: string | undefined) => void;
  setFormDate: (date: Date | undefined) => void;
  setEditingShiftId: (id: string | null) => void;
  editingShiftId: string | null;
  removeValidationWarning: (shiftId: string) => void;
}

/**
 * Hook for managing shift CRUD operations in roster builder
 */
export function useRosterShiftManagement({
  shifts,
  currentWeekStart,
  addShift,
  updateShift,
  removeShift,
  setShowShiftForm,
  setFormEmployeeId,
  setFormDate,
  setEditingShiftId,
  editingShiftId,
  removeValidationWarning,
}: UseRosterShiftManagementProps) {
  const { showError, showSuccess } = useNotification();
  const [loading, setLoading] = useState(false);

  const handleCreateShift = useCallback(
    async (shiftData: Partial<Shift>) => {
      const isEdit = !!editingShiftId;
      if (!isEdit) {
        const dateStr = shiftData.shift_date!;
        const existingShifts = shifts.filter(
          s =>
            s.employee_id === shiftData.employee_id &&
            s.shift_date === dateStr &&
            s.id !== editingShiftId,
        );
        if (existingShifts.length >= 2) {
          showError('Maximum 2 shifts per day allowed');
          return;
        }
      }
      if (isEdit) {
        const originalShift = shifts.find(s => s.id === editingShiftId);
        if (!originalShift) {
          showError('Shift not found');
          return;
        }
        await handleUpdateShiftHelper(
          editingShiftId,
          shiftData,
          originalShift,
          updateShift,
          setShowShiftForm,
          setFormEmployeeId,
          setFormDate,
          setEditingShiftId,
          showSuccess,
          showError,
        );
      } else {
        await handleCreateShiftHelper(
          shiftData,
          addShift,
          updateShift,
          removeShift,
          setShowShiftForm,
          setFormEmployeeId,
          setFormDate,
          showSuccess,
          showError,
        );
      }
    },
    [
      addShift,
      updateShift,
      removeShift,
      showSuccess,
      showError,
      setShowShiftForm,
      setFormEmployeeId,
      setFormDate,
      shifts,
      editingShiftId,
      setEditingShiftId,
    ],
  );

  const handleDeleteShift = useCallback(
    async (shiftId: string) => {
      const shiftToDelete = shifts.find(s => s.id === shiftId);
      if (!shiftToDelete) return;
      removeShift(shiftId);
      try {
        const response = await fetch(`/api/roster/shifts/${shiftId}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
          showSuccess('Shift deleted successfully');
          removeValidationWarning(shiftId);
        } else {
          addShift(shiftToDelete);
          showError(result.error || result.message || 'Failed to delete shift');
        }
      } catch (err) {
        addShift(shiftToDelete);
        logger.error('Failed to delete shift', err);
        showError('Failed to delete shift. Give it another go, chef.');
      }
    },
    [shifts, removeShift, addShift, showSuccess, showError, removeValidationWarning],
  );

  return {
    handleCreateShift,
    handleDeleteShift,
    loading,
    setLoading,
  };
}
