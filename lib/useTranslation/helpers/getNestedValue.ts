/**
 * Get nested translation value.
 */
export function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}


