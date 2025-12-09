/**
 * Calculate out of range temperature logs
 *
 * @param {any[]} todayLogs - Today's temperature logs
 * @param {any[]} equipment - Temperature equipment list
 * @returns {number} Count of out of range logs
 */
export function calculateOutOfRange(todayLogs: any[], equipment: any[]): number {
  return todayLogs.filter((log: any) => {
    const eq = equipment.find((e: any) => e.location === log.location);
    if (!eq || eq.min_temp_celsius === null || eq.max_temp_celsius === null) return false;
    return (
      log.temperature_celsius < eq.min_temp_celsius || log.temperature_celsius > eq.max_temp_celsius
    );
  }).length;
}
