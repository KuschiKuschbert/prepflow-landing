import type { ValidationRule } from '../types';

/**
 * Validate a single value against a rule
 *
 * @param {any} value - Value to validate
 * @param {ValidationRule} rule - Validation rule
 * @param {string} fieldName - Field name for error messages
 * @returns {string | null} Error message or null if valid
 */
export function validateValue(
  value: any,
  rule: ValidationRule,
  fieldName: string,
): string | null {
  if (rule.required && (value === null || value === undefined || value === '')) {
    return `${fieldName} is required`;
  }

  if (value === null || value === undefined || value === '') {
    return null;
  }

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

  if (rule.pattern && typeof value === 'string') {
    if (!rule.pattern.test(value)) {
      return `${fieldName} does not match required pattern`;
    }
  }

  if (rule.custom) {
    const customResult = rule.custom(value);
    if (customResult !== true) {
      return typeof customResult === 'string' ? customResult : `${fieldName} validation failed`;
    }
  }

  return null;
}
