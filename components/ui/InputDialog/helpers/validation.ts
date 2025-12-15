/**
 * Input validation helpers for InputDialog.
 */
export function validateInput(
  value: string,
  type: 'text' | 'number',
  min?: number,
  max?: number,
  validation?: (value: string) => string | null,
): string | null {
  if (validation) {
    const validationError = validation(value);
    if (validationError) return validationError;
  }
  if (type === 'number') {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Please enter a valid number';
    if (min !== undefined && numValue < min) return `Value must be at least ${min}`;
    if (max !== undefined && numValue > max) return `Value must be at most ${max}`;
  }
  if (!value.trim()) return 'This field is required';
  return null;
}
