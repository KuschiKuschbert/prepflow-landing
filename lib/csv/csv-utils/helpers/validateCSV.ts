/**
 * Validate CSV data against a schema
 *
 * @param {any[]} data - Data to validate
 * @param {Record<string, (value: any) => boolean | string>} schema - Validation schema
 * @returns {{ valid: boolean; errors: Array<{ row: number; field: string; error: string }> }} Validation result
 */
export function validateCSVData(
  data: any[],
  schema: Record<string, (value: any) => boolean | string>,
): { valid: boolean; errors: Array<{ row: number; field: string; error: string }> } {
  const errors: Array<{ row: number; field: string; error: string }> = [];

  data.forEach((row, index) => {
    Object.entries(schema).forEach(([field, validator]) => {
      const value = row[field];
      const result = validator(value);

      if (result !== true) {
        errors.push({
          row: index + 1,
          field,
          error: typeof result === 'string' ? result : `Invalid value for ${field}`,
        });
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
