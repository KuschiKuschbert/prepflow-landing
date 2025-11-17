import { TemperatureEquipment, TemperatureLog } from '../types';

export function useEquipmentLogInfo(allLogs: TemperatureLog[] = []) {
  const getLastLogDate = (equipment: TemperatureEquipment): string | null => {
    const lastLogInfo = getLastLogInfo(equipment);
    return lastLogInfo ? lastLogInfo.date : null;
  };

  const getLastLogInfo = (
    equipment: TemperatureEquipment,
  ): {
    date: string;
    temperature: number;
    isInRange: boolean | null;
  } | null => {
    const equipmentLogs = allLogs.filter(
      log => log.location === equipment.name || log.location === equipment.location,
    );
    if (equipmentLogs.length === 0) return null;

    const sortedLogs = equipmentLogs.sort((a, b) => {
      const dateA = new Date(`${a.log_date}T${a.log_time}`).getTime();
      const dateB = new Date(`${b.log_date}T${b.log_time}`).getTime();
      return dateB - dateA;
    });

    const lastLog = sortedLogs[0];
    if (!lastLog) return null;

    let isInRange: boolean | null = null;
    if (equipment.min_temp_celsius !== null && equipment.max_temp_celsius !== null) {
      isInRange =
        lastLog.temperature_celsius >= equipment.min_temp_celsius &&
        lastLog.temperature_celsius <= equipment.max_temp_celsius;
    } else if (equipment.min_temp_celsius !== null) {
      isInRange = lastLog.temperature_celsius >= equipment.min_temp_celsius;
    }

    return {
      date: lastLog.log_date,
      temperature: lastLog.temperature_celsius,
      isInRange,
    };
  };

  return {
    getLastLogDate,
    getLastLogInfo,
  };
}
