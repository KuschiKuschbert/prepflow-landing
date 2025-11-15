import { useCallback } from 'react';
import { TemperatureEquipment } from '../types';

interface EquipmentStatus {
  status: 'no-data' | 'no-thresholds' | 'in-range' | 'out-of-range';
  color: string;
  temperature?: number;
}

interface UseEquipmentStatusProps {
  getFilteredLogs: (equipment: TemperatureEquipment) => any[];
}

export function useEquipmentStatus({ getFilteredLogs }: UseEquipmentStatusProps) {
  const getEquipmentStatus = useCallback(
    (equipment: TemperatureEquipment): EquipmentStatus => {
      const logs = getFilteredLogs(equipment);
      if (logs.length === 0) return { status: 'no-data', color: 'text-gray-400' };

      const latestLog = logs[logs.length - 1];
      const latestTemp = latestLog.temperature_celsius;

      if (equipment.min_temp_celsius === null || equipment.max_temp_celsius === null) {
        return { status: 'no-thresholds', color: 'text-blue-400' };
      }

      const inRange =
        latestTemp >= equipment.min_temp_celsius && latestTemp <= equipment.max_temp_celsius;
      return {
        status: inRange ? 'in-range' : 'out-of-range',
        color: inRange ? 'text-green-400' : 'text-red-400',
        temperature: latestTemp,
      };
    },
    [getFilteredLogs],
  );

  const findOutOfRangeEquipment = useCallback(
    (equipment: TemperatureEquipment[]) => {
      return equipment.find(item => {
        const status = getEquipmentStatus(item);
        return status.status === 'out-of-range';
      });
    },
    [getEquipmentStatus],
  );

  return {
    getEquipmentStatus,
    findOutOfRangeEquipment,
  };
}
