import { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { TemperatureEquipment } from '../types';
import { logger } from '@/lib/logger';
interface UseTemperatureEquipmentHandlersProps {
  activeTab: 'logs' | 'equipment' | 'analytics';
  fetchAllLogs: (limit?: number, forceRefresh?: boolean) => Promise<void>;
  fetchEquipment: () => Promise<void>;
  queryClient: any;
  equipment: TemperatureEquipment[];
}

export function useTemperatureEquipmentHandlers({
  activeTab,
  fetchAllLogs,
  fetchEquipment,
  queryClient,
  equipment,
}: UseTemperatureEquipmentHandlersProps) {
  const { showError } = useNotification();
  const [quickTempLoading, setQuickTempLoading] = useState<{ [key: string]: boolean }>({});

  const handleQuickTempLog = async (
    equipmentId: string,
    equipmentName: string,
    equipmentType: string,
  ) => {
    setQuickTempLoading(prev => ({ ...prev, [equipmentId]: true }));
    try {
      const response = await fetch('/api/temperature-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          log_date: new Date().toISOString().split('T')[0],
          log_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          temperature_type: equipmentType,
          temperature_celsius: 0,
          location: equipmentName,
          notes: 'Quick log',
          logged_by: 'System',
        }),
      });
      const data = await response.json();
      if (data.success && activeTab === 'analytics') fetchAllLogs(1000).catch(() => {});
    } catch (error) {
      showError('Failed to log temperature. Please try again.');
    } finally {
      setQuickTempLoading(prev => ({ ...prev, [equipmentId]: false }));
    }
  };
  const handleUpdateEquipment = async (
    equipmentId: string,
    updates: Partial<TemperatureEquipment>,
  ) => {
    try {
      const response = await fetch(`/api/temperature-equipment/${equipmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.success) fetchEquipment();
    } catch (error) {
      // Handle update error gracefully
    }
  };
  const handleCreateEquipment = async (
    name: string,
    equipmentType: string,
    location: string | null,
    minTemp: number | null,
    maxTemp: number | null,
  ) => {
    try {
      const response = await fetch('/api/temperature-equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          equipment_type: equipmentType,
          location,
          min_temp_celsius: minTemp,
          max_temp_celsius: maxTemp,
          is_active: true,
        }),
      });
      const data = await response.json();
      if (data.success) fetchEquipment();
    } catch (error) {
      // Handle create error gracefully
    }
  };
  const handleDeleteEquipment = async (equipmentId: string) => {
    try {
      const response = await fetch(`/api/temperature-equipment/${equipmentId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) fetchEquipment();
    } catch (error) {
      // Handle delete error gracefully
    }
  };
  const handleRefreshLogs = async () => {
    logger.dev('🔄 Refreshing logs after generation...');
    await fetchAllLogs(1000, true);
    await fetchEquipment();
    queryClient.invalidateQueries({ queryKey: ['temperature-logs'] });
    equipment.forEach(eq => {
      const cacheKey = `equipment_logs_${eq.name}`;
      if (typeof window !== 'undefined' && window.sessionStorage)
        window.sessionStorage.removeItem(cacheKey);
    });
  };
  return {
    quickTempLoading,
    handleQuickTempLog,
    handleUpdateEquipment,
    handleCreateEquipment,
    handleDeleteEquipment,
    handleRefreshLogs,
  };
}
