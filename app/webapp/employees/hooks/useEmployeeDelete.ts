import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { Dispatch, SetStateAction } from 'react';
import type { Employee } from '../types';

interface UseEmployeeDeleteProps {
  employees: Employee[];
  setEmployees: Dispatch<SetStateAction<Employee[]>>;
}

export function useEmployeeDelete({ employees, setEmployees }: UseEmployeeDeleteProps) {
  const { showSuccess, showError } = useNotification();

  const deleteEmployee = async (employee: Employee) => {
    const originalEmployees = [...employees];
    const employeeId = employee.id;
    const employeeName = employee.full_name;

    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));

    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        showSuccess(`${employeeName} has been deactivated`);
        return { success: true };
      } else {
        setEmployees(originalEmployees);
        showError(data.message || data.error || 'Failed to deactivate employee');
        return { success: false };
      }
    } catch (error) {
      setEmployees(originalEmployees);
      logger.error('Error deleting employee:', error);
      showError("Couldn't deactivate that employee, chef. Try again.");
      return { success: false };
    }
  };

  return { deleteEmployee };
}
