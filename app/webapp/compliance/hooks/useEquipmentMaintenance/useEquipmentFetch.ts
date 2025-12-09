/**
 * Hook for fetching equipment maintenance records
 */

import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import type { EquipmentMaintenanceRecord } from '../../components/EquipmentMaintenanceList';

/**
 * Hook for fetching equipment maintenance records
 *
 * @returns {Object} Records, loading state, and fetch function
 */
export function useEquipmentFetch() {
  const [records, setRecords] = useState<EquipmentMaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize with cached data for instant display
  useEffect(() => {
    const cached = getCachedData('equipment_maintenance');
    if (cached) {
      setRecords(cached as EquipmentMaintenanceRecord[]);
      setLoading(false);
    }
  }, []);

  // Fetch equipment maintenance records
  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/equipment-maintenance');
      const data = await response.json();

      if (data.success && data.data) {
        setRecords(data.data);
        cacheData('equipment_maintenance', data.data);
      }
    } catch (error) {
      logger.error('Error fetching equipment maintenance records:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return { records, setRecords, loading, fetchRecords };
}
