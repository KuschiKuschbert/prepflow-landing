/**
 * Employee action helpers for roster state.
 */
import type { Employee } from '@/lib/types/roster';

import type { RosterStoreSet } from '@/lib/types/roster';

export function createEmployeeActions(set: RosterStoreSet) {
  return {
    setEmployees: (employees: Employee[]) => set({ employees }),
    setSelectedEmployeeId: (employeeId: string | null) => set({ selectedEmployeeId: employeeId }),
  };
}
