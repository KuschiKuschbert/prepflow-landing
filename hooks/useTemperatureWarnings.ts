'use client';
import { useEffect, useRef } from 'react';
import { useGlobalWarning } from '@/contexts/GlobalWarningContext';
import {
  checkFoodTemperatureWarning,
  checkEquipmentTemperatureWarning,
  checkEquipmentOutOfRangeWarning,
} from './utils/temperatureWarningChecks';
import type { TemperatureLog, TemperatureEquipment } from './types/temperature';

interface UseTemperatureWarningsProps {
  allLogs: TemperatureLog[];
  equipment: TemperatureEquipment[];
}

export const useTemperatureWarnings = ({ allLogs, equipment }: UseTemperatureWarningsProps) => {
  const { addWarning } = useGlobalWarning();
  const warningsShown = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (allLogs.length === 0 || equipment.length === 0) return;
    const foodWarning = checkFoodTemperatureWarning(allLogs, warningsShown.current);
    if (foodWarning.shouldShow && foodWarning.warning) {
      warningsShown.current.add(foodWarning.warningKey);
      addWarning(foodWarning.warning);
    }
    const equipmentWarning = checkEquipmentTemperatureWarning(
      allLogs,
      equipment,
      warningsShown.current,
    );
    if (equipmentWarning.shouldShow && equipmentWarning.warning) {
      warningsShown.current.add(equipmentWarning.warningKey);
      addWarning(equipmentWarning.warning);
    }
    const outOfRangeWarnings = checkEquipmentOutOfRangeWarning(
      allLogs,
      equipment,
      warningsShown.current,
    );
    outOfRangeWarnings.forEach(warning => {
      if (warning.shouldShow && warning.warning) {
        warningsShown.current.add(warning.warningKey);
        addWarning(warning.warning);
      }
    });
  }, [allLogs, equipment, addWarning]);
};
