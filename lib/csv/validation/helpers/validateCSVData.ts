import type { ValidationError, ValidationResult, ValidationSchema } from '../types';
import { validateValue } from './validateValue';

/**
 * Validate CSV data against a schema
 *
 * @param {any[]} data - Data rows to validate
 * @param {ValidationSchema} schema - Validation schema
 * @param {boolean} stopOnFirstError - Stop validation on first error (default: false)
 * @returns {ValidationResult} Validation result with errors and warnings
 */
export function validateCSVData(
  data: Record<string, unknown>[],
  schema: ValidationSchema,
  stopOnFirstError = false,
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 1;

    Object.entries(schema).forEach(([field, rule]) => {
      const value = row[field];
      const error = validateValue(value, rule, field);

      if (error) {
        errors.push({
          row: rowNumber,
          field,
          value,
          error,
        });

        if (stopOnFirstError) {
          return;
        }
      }
    });

    if (stopOnFirstError && errors.length > 0) {
      return;
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
