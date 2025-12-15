/**
 * Employee action helpers for roster state.
 */
import type { Employee } from '../../../types';

export function createEmployeeActions(set: any) {
  return {
    setEmployees: (employees: Employee[]) => set({ employees }),
    setSelectedEmployeeId: (employeeId: string | null) => set({ selectedEmployeeId: employeeId }),
  };
}
