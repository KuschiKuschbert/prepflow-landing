'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useCallback } from 'react';
import type { Employee } from '@/lib/types/roster';

interface UseStaffActionsProps {
  staff: Employee[];
  setStaff: React.Dispatch<React.SetStateAction<Employee[]>>;
}

export function useStaffActions({ staff, setStaff }: UseStaffActionsProps) {
  const { showSuccess, showError } = useNotification();

  const addStaffMember = useCallback(
    async (staffData: Partial<Employee>) => {
      try {
        const response = await fetch('/api/staff/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(staffData),
        });
        const data = await response.json();
        if (data.success) {
          setStaff(prev => [...prev, data.data]);
          showSuccess('Staff member added successfully');
          return data.data;
        } else {
          showError(data.message || 'Failed to add staff member');
        }
      } catch (error) {
        logger.error('Error adding staff member:', error);
        showError('Failed to add staff member. Please check your connection.');
      }
    },
    [setStaff, showSuccess, showError],
  );

  const updateStaffMember = useCallback(
    async (id: string, updates: Partial<Employee>) => {
      // Optimistic update
      const originalStaff = [...staff];
      setStaff(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));

      try {
        const response = await fetch(`/api/staff/employees/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        const data = await response.json();
        if (data.success) {
          setStaff(prev => prev.map(s => (s.id === id ? data.data : s)));
          showSuccess('Staff member updated successfully');
        } else {
          setStaff(originalStaff);
          showError(data.message || 'Failed to update staff member');
        }
      } catch (error) {
        setStaff(originalStaff);
        logger.error('Error updating staff member:', error);
        showError('Failed to update staff member. Please check your connection.');
      }
    },
    [staff, setStaff, showSuccess, showError],
  );

  const deleteStaffMember = useCallback(
    async (id: string) => {
      // Optimistic update
      const originalStaff = [...staff];
      setStaff(prev => prev.filter(s => s.id !== id));

      try {
        const response = await fetch(`/api/staff/employees/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          showSuccess('Staff member removed successfully');
        } else {
          setStaff(originalStaff);
          showError(data.message || 'Failed to remove staff member');
        }
      } catch (error) {
        setStaff(originalStaff);
        logger.error('Error removing staff member:', error);
        showError('Failed to remove staff member. Please check your connection.');
      }
    },
    [staff, setStaff, showSuccess, showError],
  );

  return {
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
  };
}
