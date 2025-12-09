/**
 * Format error details into a unified, copyable string
 * Similar to GitHub error displays
 */

import type { ErrorLog } from './types';

export function formatErrorDetails(error: ErrorLog): string {
  const parts: string[] = [];

  // Error message
  parts.push(`Error: ${error.error_message || 'No error message available'}`);

  // Stack trace
  if (error.stack_trace) {
    parts.push('');
    parts.push('Stack Trace:');
    parts.push(error.stack_trace);
  }

  // Context
  if (error.context) {
    parts.push('');
    parts.push('Context:');
    try {
      parts.push(JSON.stringify(error.context, null, 2));
    } catch {
      parts.push(String(error.context));
    }
  }

  // Endpoint
  if (error.endpoint) {
    parts.push('');
    parts.push(`Endpoint: ${error.endpoint}`);
  }

  // Metadata
  parts.push('');
  parts.push('Metadata:');
  parts.push(`  Severity: ${error.severity}`);
  parts.push(`  Category: ${error.category}`);
  parts.push(`  Status: ${error.status}`);
  parts.push(`  Created: ${new Date(error.created_at).toISOString()}`);
  if (error.resolved_at) {
    parts.push(`  Resolved: ${new Date(error.resolved_at).toISOString()}`);
  }
  if (error.user_id) {
    parts.push(`  User ID: ${error.user_id}`);
  }

  return parts.join('\n');
}
