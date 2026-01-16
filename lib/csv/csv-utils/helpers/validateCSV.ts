/**
 * Validate CSV data against a schema
 *
 * @param data - Data to validate (array of row objects)
 * @param schema - Validation schema mapping field names to validator functions
 * @returns Validation result with errors
 */
export function validateCSVData(
  data: Record<string, unknown>[],
  schema: Record<string, (value: unknown) => boolean | string>,
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
