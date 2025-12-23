import type { ValidationSchema } from '../types';

/**
 * Transform CSV data according to schema rules
 *
 * @param {any[]} data - Data to transform
 * @param {ValidationSchema} schema - Schema with transform functions
 * @returns {any[]} Transformed data
 */
export function transformCSVData(data: any[], schema: ValidationSchema): any[] {
  return data.map(row => {
    const transformedRow: any = { ...row };

    Object.entries(schema).forEach(([field, rule]) => {
      if (rule.transform && transformedRow[field] !== undefined) {
        transformedRow[field] = rule.transform(transformedRow[field]);
      }
    });

    return transformedRow;
  });
}

