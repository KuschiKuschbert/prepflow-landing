/**
 * Hook for fetching and caching compliance data.
 */

import { useCallback, useEffect, useState } from 'react';
import { logger } from '@/lib/logger';
import { cacheData, getCachedData, prefetchApis } from '@/lib/cache/data-cache';
import type { ComplianceRecord, ComplianceType } from '../types';

export function useComplianceData(selectedType: string, selectedStatus: string) {
  const [types, setTypes] = useState<ComplianceType[]>([]);
  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Prefetch APIs on mount
  useEffect(() => {
    prefetchApis(['/api/compliance-records', '/api/compliance-types']);
  }, []);

  const fetchTypes = useCallback(async () => {
    try {
      const response = await fetch('/api/compliance-types');
      const data = await response.json();
      if (data.success) {
        setTypes(data.data);
        cacheData('compliance_types', data.data);
      }
    } catch (error) {
      logger.error('Error fetching types:', error);
    }
  }, []);

  const fetchRecords = useCallback(async () => {
    try {
      let url = '/api/compliance-records';
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('type_id', selectedType);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setRecords(data.data);
        // Cache records (only cache when no filters applied for instant display)
        if (selectedType === 'all' && selectedStatus === 'all') {
          cacheData('compliance_records', data.data);
        }
      }
    } catch (error) {
      logger.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedStatus]);

  useEffect(() => {
    // Load cached data for instant display (client-only)
    const cachedTypes = getCachedData<ComplianceType[]>('compliance_types');
    if (cachedTypes && cachedTypes.length > 0) {
      setTypes(cachedTypes);
    }

    const cachedRecords = getCachedData<ComplianceRecord[]>('compliance_records');
    if (cachedRecords && cachedRecords.length > 0) {
      setRecords(cachedRecords);
    }

    // Fetch fresh data
    fetchTypes();
    fetchRecords();
  }, [fetchTypes, fetchRecords]);

  return {
    types,
    records,
    loading,
    setTypes,
    setRecords,
    setLoading,
    fetchTypes,
    fetchRecords,
  };
}
