'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { Dispatch, SetStateAction } from 'react';
import type { Employee, EmployeeFormData } from '../types';

interface UseEmployeeActionsProps {
  employees: Employee[];
  setEmployees: Dispatch<SetStateAction<Employee[]>>;
}

export function useEmployeeActions({ employees, setEmployees }: UseEmployeeActionsProps) {
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

  return {
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
