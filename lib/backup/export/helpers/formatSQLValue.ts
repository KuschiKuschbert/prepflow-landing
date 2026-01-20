export function formatSQLValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`; // Escape single quotes
  }
  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }
  if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'object') {
    const json = JSON.stringify(value);
    return `'${json.replace(/'/g, "''")}'`;
  }
  // Safe fallback for anything else
  return `'${String(value).replace(/'/g, "''")}'`;
}
