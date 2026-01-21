'use client';

import { Dispatch, SetStateAction } from 'react';
import type { Employee } from '../types';
import { useEmployeeAdd } from './useEmployeeAdd';
import { useEmployeeDelete } from './useEmployeeDelete';
import { useEmployeeUpdate } from './useEmployeeUpdate';

interface UseEmployeeActionsProps {
  employees: Employee[];
  setEmployees: Dispatch<SetStateAction<Employee[]>>;
}

export function useEmployeeActions({ employees, setEmployees }: UseEmployeeActionsProps) {
  const { addEmployee } = useEmployeeAdd({ employees, setEmployees });
  const { updateEmployee } = useEmployeeUpdate({ employees, setEmployees });
  const { deleteEmployee } = useEmployeeDelete({ employees, setEmployees });

  return {
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
