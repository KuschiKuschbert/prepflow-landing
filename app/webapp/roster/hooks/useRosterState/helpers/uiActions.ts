/**
 * UI state action helpers for roster state.
 */
import type { ShiftStatus } from '@/lib/types/roster';

import type { RosterStoreSet } from '@/lib/types/roster';

export function createUIActions(set: RosterStoreSet) {
  return {
    setShowTemplateManager: (show: boolean) => set({ showTemplateManager: show }),
    setShowShiftForm: (show: boolean) => set({ showShiftForm: show }),
    setEditingShiftId: (shiftId: string | null) => set({ editingShiftId: shiftId }),
    setFilterStatus: (status: ShiftStatus | 'all') => set({ filterStatus: status }),
    setFilterEmployeeId: (employeeId: string | null) => set({ filterEmployeeId: employeeId }),
  };
}
