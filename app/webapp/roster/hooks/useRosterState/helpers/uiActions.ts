/**
 * UI state action helpers for roster state.
 */
import type { ShiftStatus } from '../../../types';

export function createUIActions(set: any) {
  return {
    setShowTemplateManager: (show: boolean) => set({ showTemplateManager: show }),
    setShowShiftForm: (show: boolean) => set({ showShiftForm: show }),
    setEditingShiftId: (shiftId: string | null) => set({ editingShiftId: shiftId }),
    setFilterStatus: (status: ShiftStatus | 'all') => set({ filterStatus: status }),
    setFilterEmployeeId: (employeeId: string | null) => set({ filterEmployeeId: employeeId }),
  };
}
