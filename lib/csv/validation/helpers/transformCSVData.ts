import type { ValidationSchema } from '../types';

/**
 * Transform CSV data according to schema rules
 *
 * @param {T[]} data - Data to transform
 * @param {ValidationSchema} schema - Schema with transform functions
 * @returns {T[]} Transformed data
 */
export function transformCSVData<T extends object>(data: T[], schema: ValidationSchema): T[] {
  return data.map(row => {
    const transformedRow: Record<string, unknown> = { ...(row as Record<string, unknown>) };

    Object.entries(schema).forEach(([field, rule]) => {
      if (rule.transform && transformedRow[field] !== undefined) {
        transformedRow[field] = rule.transform(transformedRow[field]);
      }
    });

    return transformedRow as T;
  });
}
