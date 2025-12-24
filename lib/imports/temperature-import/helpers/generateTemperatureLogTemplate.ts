/**
 * Generate temperature log CSV template
 */
export function generateTemperatureLogTemplate(): string {
  const headers = [
    'log_date',
    'log_time',
    'temperature_type',
    'temperature_celsius',
    'location',
    'notes',
    'logged_by',
  ];

  const exampleRow = [
    '2025-01-15',
    '14:30',
    'Walk-in Freezer',
    '-18',
    'Kitchen',
    'Routine check',
    'John Smith',
  ];

  return [headers.join(','), exampleRow.join(',')].join('\n');
}
