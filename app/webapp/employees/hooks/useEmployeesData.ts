'use client';

import { logger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';
import type { Employee, QualificationType } from '../types';

export function useEmployeesData() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [qualificationTypes, setQualificationTypes] = useState<QualificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | 'active' | 'inactive' | 'terminated'
  >('active');

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/employees';
      if (selectedStatus !== 'all') {
        url += `?status=${selectedStatus}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setEmployees(data.data);
      }
    } catch (error) {
      logger.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  const fetchQualificationTypes = useCallback(async () => {
    try {
      const response = await fetch('/api/qualification-types?is_active=true');
      const data = await response.json();
      if (data.success) {
        setQualificationTypes(data.data);
      }
    } catch (error) {
      logger.error('Error fetching qualification types:', error);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchQualificationTypes();
  }, [fetchEmployees, fetchQualificationTypes]);

  return {
    employees,
    setEmployees, // Exposed for actions
    qualificationTypes,
    loading,
    selectedStatus,
    setSelectedStatus,
    fetchEmployees, // Exposed for refresh if needed
  };
}
