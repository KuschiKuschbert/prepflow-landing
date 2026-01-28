'use client';

import { logger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';
import type { Employee, QualificationType } from '../../roster/types';

export function useStaffData() {
  const [staff, setStaff] = useState<Employee[]>([]);
  const [qualificationTypes, setQualificationTypes] = useState<QualificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | 'active' | 'inactive' | 'terminated'
  >('active');

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/staff/employees?include_qualifications=true';
      if (selectedStatus !== 'all') {
        url += `&status=${selectedStatus}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setStaff(data.employees);
      }
    } catch (error) {
      logger.error('Error fetching staff:', error);
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
    fetchStaff();
    fetchQualificationTypes();
  }, [fetchStaff, fetchQualificationTypes]);

  return {
    staff,
    setStaff,
    qualificationTypes,
    loading,
    selectedStatus,
    setSelectedStatus,
    fetchStaff,
  };
}
