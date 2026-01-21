import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { Dispatch, SetStateAction } from 'react';
import type { Employee, EmployeeFormData } from '../types';

interface UseEmployeeAddProps {
  employees: Employee[];
  setEmployees: Dispatch<SetStateAction<Employee[]>>;
}

export function useEmployeeAdd({ employees, setEmployees }: UseEmployeeAddProps) {
  const { showSuccess, showError } = useNotification();

  const addEmployee = async (newEmployee: EmployeeFormData) => {
    const originalEmployees = [...employees];
    const tempId = `temp-${Date.now()}`;
    const tempEmployee: Employee = {
      id: tempId,
      ...newEmployee,
      employment_end_date: newEmployee.employment_end_date || null,
      phone: newEmployee.phone || null,
      email: newEmployee.email || null,
      emergency_contact: newEmployee.emergency_contact || null,
      notes: newEmployee.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setEmployees([tempEmployee, ...employees]);

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEmployee,
          employment_end_date: newEmployee.employment_end_date || null,
          phone: newEmployee.phone || null,
          email: newEmployee.email || null,
          emergency_contact: newEmployee.emergency_contact || null,
          notes: newEmployee.notes || null,
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setEmployees(prev => prev.map(emp => (emp.id === tempId ? data.data : emp)));
        showSuccess('Employee added successfully');
        return { success: true };
      } else {
        setEmployees(originalEmployees);
        showError(data.message || data.error || 'Failed to add employee');
        return { success: false };
      }
    } catch (error) {
      setEmployees(originalEmployees);
      logger.error('Error adding employee:', error);
      showError("Couldn't add that employee, chef. Give it another go.");
      return { success: false };
    }
  };

  return { addEmployee };
}
