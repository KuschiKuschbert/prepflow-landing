import { useCallback, useState } from 'react';
import { format, addDays } from 'date-fns';
import type { Shift } from '../../../types';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

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
        // Check shift limit before creating (not for edits)
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
        // Update existing shift
        const originalShift = shifts.find(s => s.id === editingShiftId);
        if (!originalShift) {
          showError('Shift not found');
          return;
        }

        // Optimistic update
        updateShift(editingShiftId, shiftData);

        try {
          const response = await fetch(`/api/roster/shifts/${editingShiftId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(shiftData),
          });

          const result = await response.json();

          if (response.ok && result.shift) {
            // Update with server response
            updateShift(editingShiftId, result.shift);
            showSuccess('Shift updated successfully');
            setShowShiftForm(false);
            setFormEmployeeId(undefined);
            setFormDate(undefined);
            setEditingShiftId(null);
          } else {
            // Revert on error
            updateShift(editingShiftId, originalShift);
            showError(result.error || result.message || 'Failed to update shift');
          }
        } catch (err) {
          // Revert on error
          updateShift(editingShiftId, originalShift);
          logger.error('Failed to update shift', err);
          showError('Failed to update shift. Please try again.');
        }
      } else {
        // Create new shift
        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const tempShift: Shift = {
          id: tempId,
          employee_id: shiftData.employee_id!,
          shift_date: shiftData.shift_date!,
          start_time: shiftData.start_time!,
          end_time: shiftData.end_time!,
          status: shiftData.status || 'draft',
          role: shiftData.role || null,
          break_duration_minutes: shiftData.break_duration_minutes || 0,
          notes: shiftData.notes || null,
          template_shift_id: shiftData.template_shift_id || null,
          published_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Add to state immediately
        addShift(tempShift);

        try {
          const response = await fetch('/api/roster/shifts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(shiftData),
          });

          const result = await response.json();

          if (response.ok && result.shift) {
            // Replace temp shift with real shift from server
            updateShift(tempId, result.shift);
            showSuccess('Shift created successfully');
            setShowShiftForm(false);
            setFormEmployeeId(undefined);
            setFormDate(undefined);
          } else {
            // Revert on error
            removeShift(tempId);
            showError(result.error || result.message || 'Failed to create shift');
          }
        } catch (err) {
          // Revert on error
          removeShift(tempId);
          logger.error('Failed to create shift', err);
          showError('Failed to create shift. Please try again.');
        }
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

      // Optimistic update - remove immediately
      removeShift(shiftId);

      try {
        const response = await fetch(`/api/roster/shifts/${shiftId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (response.ok) {
          showSuccess('Shift deleted successfully');
          // Remove validation warnings for this shift
          removeValidationWarning(shiftId);
        } else {
          // Revert on error - add shift back
          addShift(shiftToDelete);
          showError(result.error || result.message || 'Failed to delete shift');
        }
      } catch (err) {
        // Revert on error - add shift back
        addShift(shiftToDelete);
        logger.error('Failed to delete shift', err);
        showError('Failed to delete shift. Please try again.');
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
