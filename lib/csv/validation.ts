/**
 * CSV validation utilities for pre-import validation
 * Provides schema-based validation with type checking and custom rules
 */

export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'email';
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  transform?: (value: any) => any;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export interface ValidationError {
  row: number;
  field: string;
  value: any;
  error: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate a single value against a rule
 *
 * @param {any} value - Value to validate
 * @param {ValidationRule} rule - Validation rule
 * @param {string} fieldName - Field name for error messages
 * @returns {string | null} Error message or null if valid
 */
function validateValue(value: any, rule: ValidationRule, fieldName: string): string | null {
  // Check required
  if (rule.required && (value === null || value === undefined || value === '')) {
    return `${fieldName} is required`;
  }

  // Skip other checks if value is empty and not required
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // Type checking
  if (rule.type) {
    switch (rule.type) {
      case 'string':
        if (typeof value !== 'string') {
          return `${fieldName} must be a string`;
        }
        break;
      case 'number':
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numValue)) {
          return `${fieldName} must be a number`;
        }
        if (rule.min !== undefined && numValue < rule.min) {
          return `${fieldName} must be at least ${rule.min}`;
        }
        if (rule.max !== undefined && numValue > rule.max) {
          return `${fieldName} must be at most ${rule.max}`;
        }
        break;
      case 'boolean':
        if (
          typeof value !== 'boolean' &&
          value !== 'true' &&
          value !== 'false' &&
          value !== '1' &&
          value !== '0'
        ) {
          return `${fieldName} must be a boolean`;
        }
        break;
      case 'date':
        const dateValue = new Date(value);
        if (isNaN(dateValue.getTime())) {
          return `${fieldName} must be a valid date`;
        }
        break;
      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(String(value))) {
          return `${fieldName} must be a valid email address`;
        }
        break;
    }
  }

  // Pattern matching
  if (rule.pattern && typeof value === 'string') {
    if (!rule.pattern.test(value)) {
      return `${fieldName} does not match required pattern`;
    }
  }

  // Custom validation
  if (rule.custom) {
    const customResult = rule.custom(value);
    if (customResult !== true) {
      return typeof customResult === 'string' ? customResult : `${fieldName} validation failed`;
    }
  }

  return null;
}

/**
 * Validate CSV data against a schema
 *
 * @param {any[]} data - Data rows to validate
 * @param {ValidationSchema} schema - Validation schema
 * @param {boolean} stopOnFirstError - Stop validation on first error (default: false)
 * @returns {ValidationResult} Validation result with errors and warnings
 *
 * @example
 * ```typescript
 * const schema: ValidationSchema = {
 *   ingredient_name: { required: true, type: 'string', min: 1 },
 *   cost_per_unit: { required: true, type: 'number', min: 0 },
 *   unit: { required: true, type: 'string' }
 * };
 * const result = validateCSVData(data, schema);
 * ```
 */
export function validateCSVData(
  data: any[],
  schema: ValidationSchema,
  stopOnFirstError = false,
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 1; // 1-indexed for user display

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

/**
 * Transform CSV data according to schema rules
 *
 * @param {any[]} data - Data to transform
 * @param {ValidationSchema} schema - Schema with transform functions
 * @returns {any[]} Transformed data
 *
 * @example
 * ```typescript
 * const schema: ValidationSchema = {
 *   cost_per_unit: { transform: (v) => parseFloat(v) || 0 },
 *   unit: { transform: (v) => String(v).toUpperCase() }
 * };
 * const transformed = transformCSVData(data, schema);
 * ```
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

/**
 * Get validation schema for ingredients
 *
 * @returns {ValidationSchema} Ingredients validation schema
 */
export function getIngredientsValidationSchema(): ValidationSchema {
  return {
    ingredient_name: {
      required: true,
      type: 'string',
      custom: value => {
        if (typeof value !== 'string' || value.trim().length === 0) {
          return 'Ingredient name is required';
        }
        return true;
      },
      transform: value => String(value).trim(),
    },
    cost_per_unit: {
      required: true,
      type: 'number',
      min: 0,
      transform: value => {
        const num = parseFloat(String(value));
        return isNaN(num) ? 0 : num;
      },
    },
    unit: {
      required: false,
      type: 'string',
      transform: value => (value ? String(value).toUpperCase().trim() : 'GM'),
    },
    brand: {
      required: false,
      type: 'string',
      transform: value => (value ? String(value).trim() : null),
    },
    supplier: {
      required: false,
      type: 'string',
      transform: value => (value ? String(value).trim() : null),
    },
    storage_location: {
      required: false,
      type: 'string',
      transform: value => (value ? String(value).trim() : null),
    },
    product_code: {
      required: false,
      type: 'string',
      transform: value => (value ? String(value).trim() : null),
    },
    pack_size: {
      required: false,
      type: 'string',
      transform: value => (value ? String(value).trim() : '1'),
    },
    pack_size_unit: {
      required: false,
      type: 'string',
      transform: value => (value ? String(value).trim() : null),
    },
    pack_price: {
      required: false,
      type: 'number',
      min: 0,
      transform: value => {
        const num = parseFloat(String(value));
        return isNaN(num) ? null : num;
      },
    },
    min_stock_level: {
      required: false,
      type: 'number',
      min: 0,
      transform: value => {
        const num = parseFloat(String(value));
        return isNaN(num) ? null : num;
      },
    },
    current_stock: {
      required: false,
      type: 'number',
      min: 0,
      transform: value => {
        const num = parseFloat(String(value));
        return isNaN(num) ? null : num;
      },
    },
  };
}

/**
 * Get validation schema for performance data
 *
 * @returns {ValidationSchema} Performance data validation schema
 */
export function getPerformanceValidationSchema(): ValidationSchema {
  return {
    dish_name: {
      required: true,
      type: 'string',
      custom: value => {
        if (typeof value !== 'string' || value.trim().length === 0) {
          return 'Dish name is required';
        }
        return true;
      },
      transform: value => String(value).trim(),
    },
    number_sold: {
      required: true,
      type: 'number',
      min: 0,
      transform: value => {
        const num = parseInt(String(value), 10);
        return isNaN(num) ? 0 : num;
      },
    },
    popularity_percentage: {
      required: false,
      type: 'number',
      min: 0,
      max: 100,
      transform: value => {
        const num = parseFloat(String(value));
        return isNaN(num) ? 0 : num;
      },
    },
  };
}




