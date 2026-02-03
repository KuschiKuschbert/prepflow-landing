'use client';

import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';

export interface StaffMember {
  id: string;
  full_name: string;
  role: string | null;
}

/**
 * Hook to fetch active staff members with caching support
 * Returns array of staff members formatted for dropdowns
 */
export function useStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize with cached data for instant display
  useEffect(() => {
    const cached = getCachedData<StaffMember[]>('staff_members');
    if (cached) {
      setStaff(cached);
      setLoading(false);
    }
  }, []);

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/employees?status=active');
      const data = await response.json();

      if (data.success && data.data) {
        // Format staff members for dropdowns: { id, full_name, role }
        interface EmployeeApiItem {
          id: string;
          full_name: string;
          role?: string | null;
        }
        const formattedStaff: StaffMember[] = data.data.map((employee: EmployeeApiItem) => ({
          id: employee.id,
          full_name: employee.full_name,
          role: employee.role || null,
        }));

        // Sort by full_name for consistent ordering
        formattedStaff.sort((a, b) => a.full_name.localeCompare(b.full_name));

        setStaff(formattedStaff);
        cacheData('staff_members', formattedStaff);
      } else {
        throw new Error(data.error || 'Failed to fetch staff members');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('[useStaff] Error fetching staff members:', {
        error: error.message,
        stack: error.stack,
        context: { endpoint: '/api/employees?status=active', operation: 'fetchStaff' },
      });
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch fresh data on mount if no cache
  useEffect(() => {
    if (staff.length === 0 && !loading) {
      fetchStaff();
    }
  }, [staff.length, loading, fetchStaff]);

  return {
    staff,
    loading,
    error,
    refetch: fetchStaff,
  };
}
