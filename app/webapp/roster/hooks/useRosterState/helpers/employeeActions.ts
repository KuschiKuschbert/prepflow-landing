/**
 * Employee action helpers for roster state.
 */
import type { Employee } from '../../../types';

import type { RosterStoreSet } from '../types';

export function createEmployeeActions(set: RosterStoreSet) {
  return {
    setEmployees: (employees: Employee[]) => set({ employees }),
    setSelectedEmployeeId: (employeeId: string | null) => set({ selectedEmployeeId: employeeId }),
  };
}
