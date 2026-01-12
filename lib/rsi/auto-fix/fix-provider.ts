/**
 * Fix Provider Interface
 * Standard interface for any module that can provide automated fixes.
 */

export interface FixSuggestion {
  id: string; // Unique ID for this specific fix instance
  description: string;
  file: string;
  type: string; // e.g., 'cleanup', 'error-fix', 'refactor'
  confidenceScore: number; // 0-1
  apply: () => Promise<boolean>; // Function to apply the fix
  verify?: () => Promise<boolean>; // Optional verification function
}

export interface FixProvider {
  name: string;
  scan(files?: string[]): Promise<FixSuggestion[]>;
}
