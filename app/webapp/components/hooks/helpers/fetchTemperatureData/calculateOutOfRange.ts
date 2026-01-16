import { TemperatureEquipment, TemperatureLog } from '../../../../temperature/types';

/**
 * Calculate out of range temperature logs
 *
 * @param {TemperatureLog[]} todayLogs - Today's temperature logs
 * @param {TemperatureEquipment[]} equipment - Temperature equipment list
 * @returns {number} Count of out of range logs
 */
export function calculateOutOfRange(
  todayLogs: TemperatureLog[],
  equipment: TemperatureEquipment[],
): number {
  return todayLogs.filter(log => {
    const eq = equipment.find(e => e.location === log.location);
    if (!eq || eq.min_temp_celsius === null || eq.max_temp_celsius === null) return false;
    return (
      log.temperature_celsius < eq.min_temp_celsius || log.temperature_celsius > eq.max_temp_celsius
    );
  }).length;
}
