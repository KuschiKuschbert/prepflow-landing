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
  setEquipment: React.Dispatch<React.SetStateAction<TemperatureEquipment[]>>;
}

export function useTemperatureEquipmentHandlers({
  activeTab,
  fetchAllLogs,
  fetchEquipment,
  queryClient,
  equipment,
  setEquipment,
}: UseTemperatureEquipmentHandlersProps) {
  const { showError, showSuccess } = useNotification();
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
    // Store original state for rollback
    const originalEquipment = [...equipment];
    const equipmentToUpdate = equipment.find(eq => eq.id === equipmentId);

    if (!equipmentToUpdate) {
      showError('Equipment not found');
      return;
    }

    // Optimistically update UI immediately
    setEquipment(prevEquipment =>
      prevEquipment.map(eq => (eq.id === equipmentId ? { ...eq, ...updates } : eq)),
    );

    try {
      const response = await fetch(`/api/temperature-equipment/${equipmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.success) {
        // Success - optimistic update already applied
        // Optionally refresh in background for accuracy (non-blocking)
        fetchEquipment().catch(err => logger.error('Failed to refresh equipment:', err));
      } else {
        // Revert optimistic update on error
        setEquipment(originalEquipment);
        showError(data.error || 'Failed to update equipment');
      }
    } catch (error) {
      // Revert optimistic update on error
      setEquipment(originalEquipment);
      logger.error('Failed to update equipment:', error);
      showError('Failed to update equipment. Please check your connection and try again.');
    }
  };
  const handleCreateEquipment = async (
    name: string,
    equipmentType: string,
    location: string | null,
    minTemp: number | null,
    maxTemp: number | null,
  ) => {
    // Store original state for rollback
    const originalEquipment = [...equipment];

    // Create temporary equipment for optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempEquipment: TemperatureEquipment = {
      id: tempId,
      name,
      equipment_type: equipmentType,
      location,
      min_temp_celsius: minTemp,
      max_temp_celsius: maxTemp,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistically add to UI immediately
    setEquipment(prevEquipment => [...prevEquipment, tempEquipment]);

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
      if (data.success && data.item) {
        // Replace temp equipment with real equipment from server
        setEquipment(prevEquipment => prevEquipment.map(eq => (eq.id === tempId ? data.item : eq)));
        showSuccess('Equipment created successfully');
        // Optionally refresh in background for accuracy (non-blocking)
        fetchEquipment().catch(err => logger.error('Failed to refresh equipment:', err));
      } else {
        // Revert optimistic update on error
        setEquipment(originalEquipment);
        showError(data.error || 'Failed to create equipment');
      }
    } catch (error) {
      // Revert optimistic update on error
      setEquipment(originalEquipment);
      logger.error('Failed to create equipment:', error);
      showError('Failed to create equipment. Please check your connection and try again.');
    }
  };
  const handleDeleteEquipment = async (equipmentId: string) => {
    // Store original state for rollback
    const originalEquipment = [...equipment];
    const equipmentToDelete = equipment.find(eq => eq.id === equipmentId);

    if (!equipmentToDelete) {
      showError('Equipment not found');
      return;
    }

    // Optimistically remove from UI immediately
    setEquipment(prevEquipment => prevEquipment.filter(eq => eq.id !== equipmentId));

    try {
      const response = await fetch(`/api/temperature-equipment/${equipmentId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        showSuccess('Equipment deleted successfully');
        // Optionally refresh in background for accuracy (non-blocking)
        fetchEquipment().catch(err => logger.error('Failed to refresh equipment:', err));
      } else {
        // Revert optimistic update on error
        setEquipment(originalEquipment);
        showError(data.error || 'Failed to delete equipment');
      }
    } catch (error) {
      // Revert optimistic update on error
      setEquipment(originalEquipment);
      logger.error('Failed to delete equipment:', error);
      showError('Failed to delete equipment. Please check your connection and try again.');
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
