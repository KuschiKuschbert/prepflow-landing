import { useNotification } from '@/contexts/NotificationContext';
import { useCallback, useState } from 'react';
import type { Shift } from '@/lib/types/roster';
import { handleCreateShiftHelper } from './useRosterShiftManagement/helpers/handleCreateShift';
import { handleDeleteShiftHelper } from './useRosterShiftManagement/helpers/handleDeleteShift';
import { handleUpdateShiftHelper } from './useRosterShiftManagement/helpers/handleUpdateShift';
import { validateShiftCreation } from './useRosterShiftManagement/helpers/validateShiftCreation';

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
  currentWeekStart: _currentWeekStart,
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
        const validation = validateShiftCreation({ shiftData, shifts, editingShiftId });
        if (!validation.isValid) {
          showError(validation.error!);
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
      await handleDeleteShiftHelper({
        shiftId,
        shifts,
        removeShift,
        addShift,
        showSuccess,
        showError,
        removeValidationWarning,
      });
    },
    [shifts, removeShift, addShift, showSuccess, showError, removeValidationWarning],
  );

  return { handleCreateShift, handleDeleteShift, loading, setLoading };
}
