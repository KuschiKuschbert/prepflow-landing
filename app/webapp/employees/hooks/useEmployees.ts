'use client';

import { useEmployeeActions } from './useEmployeeActions';
import { useEmployeesData } from './useEmployeesData';

export function useEmployees() {
  const {
    employees,
    setEmployees,
    qualificationTypes,
    loading,
    selectedStatus,
    setSelectedStatus,
  } = useEmployeesData();

  const { addEmployee, updateEmployee, deleteEmployee } = useEmployeeActions({
    employees,
    setEmployees,
  });

  return {
    employees,
    qualificationTypes,
    loading,
    selectedStatus,
    setSelectedStatus,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
