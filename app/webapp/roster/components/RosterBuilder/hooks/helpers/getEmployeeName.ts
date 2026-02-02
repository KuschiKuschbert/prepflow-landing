/**
 * Get employee name from employees list.
 */
import type { Employee } from '@/lib/types/roster';

export function getEmployeeName(employees: Employee[], employeeId: string): string {
  const employee = employees.find(e => e.id === employeeId);
  return employee ? `${employee.first_name} ${employee.last_name}` : 'this employee';
}
