import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { Dispatch, SetStateAction } from 'react';
import type { Employee, EmployeeFormData } from '../types';

interface UseEmployeeUpdateProps {
  employees: Employee[];
  setEmployees: Dispatch<SetStateAction<Employee[]>>;
}

export function useEmployeeUpdate({ employees, setEmployees }: UseEmployeeUpdateProps) {
  const { showSuccess, showError } = useNotification();

  const updateEmployee = async (employee: Employee, updates: Partial<EmployeeFormData>) => {
    const originalEmployees = [...employees];

    setEmployees(prev =>
      prev.map(emp =>
        emp.id === employee.id
          ? {
              ...emp,
              ...updates,
              employment_end_date: updates.employment_end_date || null,
              phone: updates.phone || null,
              email: updates.email || null,
              emergency_contact: updates.emergency_contact || null,
              notes: updates.notes || null,
            }
          : emp,
      ),
    );

    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          employment_end_date: updates.employment_end_date || null,
          phone: updates.phone || null,
          email: updates.email || null,
          emergency_contact: updates.emergency_contact || null,
          notes: updates.notes || null,
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setEmployees(prev => prev.map(emp => (emp.id === employee.id ? data.data : emp)));
        showSuccess('Employee updated successfully');
        return { success: true };
      } else {
        setEmployees(originalEmployees);
        showError(data.message || data.error || 'Failed to update employee');
        return { success: false };
      }
    } catch (error) {
      setEmployees(originalEmployees);
      logger.error('Error updating employee:', error);
      showError("Couldn't update that employee, chef. Give it another shot.");
      return { success: false };
    }
  };

  return { updateEmployee };
}
