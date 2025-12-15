import { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { handleQuickTempLog as handleQuickTempLogHelper } from './useTemperatureEquipmentHandlers/quickTempLog';
import { handleRefreshLogs as handleRefreshLogsHelper } from './useTemperatureEquipmentHandlers/refreshLogs';
import { useOnTemperatureLogged } from '@/lib/personality/hooks';
import { createEquipmentHandlers } from './useTemperatureEquipmentHandlers/helpers/createHandlers';
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
  const onTemperatureLogged = useOnTemperatureLogged();
  const [quickTempLoading, setQuickTempLoading] = useState<{ [key: string]: boolean }>({});

  const handleQuickTempLog = async (
    equipmentId: string,
    equipmentName: string,
    equipmentType: string,
  ) => {
    const success = await handleQuickTempLogHelper({
      equipmentId,
      equipmentName,
      equipmentType,
      activeTab,
      fetchAllLogs,
      setQuickTempLoading,
      showError,
    });

    // Trigger personality hook after successful quick temp log
    if (success) {
      onTemperatureLogged();
    }
  };
  const { handleUpdateEquipment, handleCreateEquipment, handleDeleteEquipment } = createEquipmentHandlers(equipment, setEquipment, fetchEquipment, showError, showSuccess);
  const handleRefreshLogs = async () => {
    await handleRefreshLogsHelper({
      fetchAllLogs,
      fetchEquipment,
      queryClient,
      equipment,
    });
  };
  return { quickTempLoading, handleQuickTempLog, handleUpdateEquipment, handleCreateEquipment, handleDeleteEquipment, handleRefreshLogs };
}
