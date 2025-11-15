import { TemperatureEquipment } from '../types';
import { useTemperatureLogHandlers } from './useTemperatureLogHandlers';
import { useTemperatureEquipmentHandlers } from './useTemperatureEquipmentHandlers';

interface UseTemperaturePageHandlersProps {
  activeTab: 'logs' | 'equipment' | 'analytics';
  fetchAllLogs: (limit?: number, forceRefresh?: boolean) => Promise<void>;
  fetchEquipment: () => Promise<void>;
  queryClient: any;
  equipment: TemperatureEquipment[];
}

export function useTemperaturePageHandlers({
  activeTab,
  fetchAllLogs,
  fetchEquipment,
  queryClient,
  equipment,
}: UseTemperaturePageHandlersProps) {
  const logHandlers = useTemperatureLogHandlers({ activeTab, fetchAllLogs });
  const equipmentHandlers = useTemperatureEquipmentHandlers({
    activeTab,
    fetchAllLogs,
    fetchEquipment,
    queryClient,
    equipment,
  });

  return {
    ...logHandlers,
    ...equipmentHandlers,
  };
}
