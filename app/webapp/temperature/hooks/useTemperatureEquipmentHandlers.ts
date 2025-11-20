import { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import type { TemperatureEquipment } from '../types';
import {
  updateEquipment,
  createEquipment,
  deleteEquipment,
} from './useTemperatureEquipmentHandlers/equipmentCRUD';
import { handleQuickTempLog as handleQuickTempLogHelper } from './useTemperatureEquipmentHandlers/quickTempLog';
import { handleRefreshLogs as handleRefreshLogsHelper } from './useTemperatureEquipmentHandlers/refreshLogs';
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
    await handleQuickTempLogHelper({
      equipmentId,
      equipmentName,
      equipmentType,
      activeTab,
      fetchAllLogs,
      setQuickTempLoading,
      showError,
    });
  };

  const handleUpdateEquipment = async (
    equipmentId: string,
    updates: Partial<TemperatureEquipment>,
  ) => {
    await updateEquipment(equipmentId, updates, {
      equipment,
      setEquipment,
      fetchEquipment,
      showError,
      showSuccess,
    });
  };

  const handleCreateEquipment = async (
    name: string,
    equipmentType: string,
    location: string | null,
    minTemp: number | null,
    maxTemp: number | null,
  ) => {
    await createEquipment(name, equipmentType, location, minTemp, maxTemp, {
      equipment,
      setEquipment,
      fetchEquipment,
      showError,
      showSuccess,
    });
  };

  const handleDeleteEquipment = async (equipmentId: string) => {
    await deleteEquipment(equipmentId, {
      equipment,
      setEquipment,
      fetchEquipment,
      showError,
      showSuccess,
    });
  };

  const handleRefreshLogs = async () => {
    await handleRefreshLogsHelper({
      fetchAllLogs,
      fetchEquipment,
      queryClient,
      equipment,
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
