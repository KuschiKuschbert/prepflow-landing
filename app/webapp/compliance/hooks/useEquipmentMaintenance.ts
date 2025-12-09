'use client';

import { useCallback } from 'react';
import { logger } from '@/lib/logger';
import { cacheData } from '@/lib/cache/data-cache';
import { useEquipmentFetch } from './useEquipmentMaintenance/useEquipmentFetch';
import { useEquipmentForm } from './useEquipmentMaintenance/useEquipmentForm';

/**
 * Hook for managing equipment maintenance
 *
 * @returns {Object} Equipment maintenance state and handlers
 */
export function useEquipmentMaintenance() {
  const { records, setRecords, loading, fetchRecords } = useEquipmentFetch();
  const { newEquipment, setNewEquipment, resetForm } = useEquipmentForm();

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
          resetForm();
          return true;
        }
        return false;
      } catch (error) {
        logger.error('Error adding equipment maintenance record:', error);
        return false;
      }
    },
    [newEquipment, records, setRecords, resetForm],
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
