'use client';

import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import type { EquipmentMaintenanceFormData } from '../components/EquipmentMaintenanceForm';
import type { EquipmentMaintenanceRecord } from '../components/EquipmentMaintenanceList';

export function useEquipmentMaintenance() {
  const [records, setRecords] = useState<EquipmentMaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEquipment, setNewEquipment] = useState<EquipmentMaintenanceFormData>({
    equipment_name: '',
    equipment_type: '',
    maintenance_date: new Date().toISOString().split('T')[0],
    maintenance_type: '',
    service_provider: '',
    description: '',
    cost: '',
    next_maintenance_date: '',
    is_critical: false,
    performed_by: '',
    notes: '',
    photo_url: '',
  });

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

  // Handle add equipment maintenance
  const handleAddEquipment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await fetch('/api/equipment-maintenance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newEquipment,
            cost: newEquipment.cost ? parseFloat(newEquipment.cost) : null,
          }),
        });
        const data = await response.json();
        if (data.success) {
          const updatedRecords = [data.data, ...records];
          setRecords(updatedRecords);
          cacheData('equipment_maintenance', updatedRecords);
          setNewEquipment({
            equipment_name: '',
            equipment_type: '',
            maintenance_date: new Date().toISOString().split('T')[0],
            maintenance_type: '',
            service_provider: '',
            description: '',
            cost: '',
            next_maintenance_date: '',
            is_critical: false,
            performed_by: '',
            notes: '',
            photo_url: '',
          });
          return true;
        }
        return false;
      } catch (error) {
        logger.error('Error adding equipment maintenance record:', error);
        return false;
      }
    },
    [newEquipment, records],
  );

  return {
    records,
    loading,
    newEquipment,
    setNewEquipment,
    handleAddEquipment,
    fetchRecords,
  };
}

