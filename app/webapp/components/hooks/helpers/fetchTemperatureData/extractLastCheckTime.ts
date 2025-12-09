/**
 * Extract last check time from logs
 *
 * @param {any[]} logs - Temperature logs
 * @returns {string | undefined} Last check time string
 */
export function extractLastCheckTime(logs: any[]): string | undefined {
  if (logs.length === 0) return undefined;
  const lastLog = logs[0];
  return lastLog.log_date && lastLog.log_time
    ? `${lastLog.log_date}T${lastLog.log_time}`
    : lastLog.created_at;
}
