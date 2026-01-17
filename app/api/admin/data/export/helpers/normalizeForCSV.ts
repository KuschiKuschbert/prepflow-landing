export function normalizeForCSV(data: Record<string, unknown>[]): Record<string, string>[] {
  return data.map(row => {
    const normalized: Record<string, string> = {};
    Object.keys(row).forEach(key => {
      const value = row[key];
      if (value === null || value === undefined) {
        normalized[key] = '';
      } else if (typeof value === 'object') {
        normalized[key] = JSON.stringify(value);
      } else {
        normalized[key] = String(value);
      }
    });
    return normalized;
  });
}
