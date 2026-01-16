'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useCallback } from 'react';
import type { EquipmentMaintenanceRecord } from '../components/EquipmentMaintenanceList';
import { useEquipmentFetch } from './useEquipmentMaintenance/useEquipmentFetch';
import { useEquipmentForm } from './useEquipmentMaintenance/useEquipmentForm';

/**
 * Hook for managing equipment maintenance
 *
 * @returns {Object} Equipment maintenance state and handlers
 */
export function useEquipmentMaintenance() {
  const { showSuccess, showError } = useNotification();
  const { records, setRecords, loading, fetchRecords } = useEquipmentFetch();
  const { newEquipment, setNewEquipment, resetForm } = useEquipmentForm();

  // Handle add equipment maintenance
  const handleAddEquipment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // Store original state for rollback
      const originalRecords = [...records];

      // Create temporary record for optimistic update (structure depends on API response)
      const tempId = `temp-${Date.now()}`;
      const tempRecord = {
        id: tempId,
        ...newEquipment,
        cost: newEquipment.cost ? parseFloat(newEquipment.cost) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Optimistically add to UI immediately
      const updatedRecords = [tempRecord as unknown as EquipmentMaintenanceRecord, ...records];
      setRecords(updatedRecords);
      resetForm();

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
        if (data.success && data.data) {
          // Replace temp record with real one from server
          setRecords(prev => prev.map(r => (r.id === tempId ? data.data : r)));
          cacheData('equipment_maintenance', [data.data, ...originalRecords]);
          showSuccess('Equipment maintenance record added successfully');
          return true;
        }
        // Rollback on error
        setRecords(originalRecords);
        showError(data.message || data.error || 'Failed to add equipment maintenance record');
        return false;
      } catch (error) {
        // Rollback on error
        setRecords(originalRecords);
        logger.error('Error adding equipment maintenance record:', error);
        showError(
          'Failed to add equipment maintenance record. Please check your connection and try again.',
        );
        return false;
      }
    },
    [newEquipment, records, setRecords, resetForm, showSuccess, showError],
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
