export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'email';
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | string;
  transform?: (value: unknown) => unknown;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export interface ValidationError {
  row: number;
  field: string;
  value: unknown;
  error: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}
